import WebSocket from "isomorphic-ws";
import ReconnectingWebSocket from "reconnecting-websocket";

import { User } from "../entities";

const heartbeatInterval = 8000;
const apiUrl = "wss://api.spek.app/ws";
const connectionTimeout = 15000;

export type Token = string;
export type Opcode = string;

export type ListenerHandler<Data = unknown> = (
  data: Data,
  fetchId?: string
) => void;
export type Listener<Data = unknown> = {
  opcode: Opcode;
  handler: ListenerHandler<Data>;
};

export type WSConnection = {
  close: () => void;
  user: User;
  once: <Data = unknown>(
    opcode: Opcode,
    handler: ListenerHandler<Data>
  ) => void;
  addListener: <Data = unknown>(
    opcode: Opcode,
    handler: ListenerHandler<Data>
  ) => () => void;
};

export const connect = (
  token: Token,
  refreshToken: Token,
  {
    logger = () => {},
    onConnectionTaken = () => {},
    url = apiUrl,
    onClearTokens = () => {},
    getAuthOptions,
  }: {
    logger?: any;
    onConnectionTaken?: () => void;
    onClearTokens?: () => void;
    url: string;
    getAuthOptions?: () => Partial<{
      reconnectToVoice: boolean;
      currentRoomId: string | null;
      muted: boolean;
      token: Token;
      refreshToken: Token;
    }>;
  }
): Promise<WSConnection> =>
  new Promise((reslove, reject) => {
    const socket = new ReconnectingWebSocket(url, [], {
      connectionTimeout,
      WebSocket,
    });

    const apiSend = (opcode: Opcode, data: unknown, fetchId?: string) => {
      const raw = `{"op":"${opcode}","d":${JSON.stringify(data)}${
        fetchId ? `,"fetchId":"${fetchId}"` : ""
      }}`;

      socket.send(raw);
      logger("out", opcode, data, fetchId, raw);
    };

    const listeners: Listener[] = [];

    // close & message listener needs to be outside of open
    // this prevents multiple listeners from being created on reconnect
    socket.addEventListener("close", (error) => {
      if (error.code === 4001) {
        socket.close();
        onClearTokens();
      } else if (error.code === 4003) {
        socket.close();
        onConnectionTaken();
      } else if (error.code === 4004) {
        socket.close();
        onClearTokens();
      }
      reject(error);
    });

    socket.addEventListener("message", (e) => {
      if (e.data == `"pong"`) {
        logger("in", "pong");
        return;
      }

      const message = JSON.parse(e.data);

      logger("in", message.op, message.d, e.data);

      if (message.op == "auth-good") {
        const connection: WSConnection = {
          close: () => socket.close(),
          user: message.d.user,
          once: (opcode, handler) => {
            const listener = { opcode, handler } as Listener<unknown>;

            listener.handler = (...params) => {
              handler(...(params as Parameters<typeof handler>));
              listeners.splice(listeners.indexOf(listener), 1);
            };

            listeners.push(listener);
          },
          addListener: (opcode, handler) => {
            const listener = { opcode, handler } as Listener<unknown>;

            listeners.push(listener);

            return () => listeners.splice(listeners.indexOf(listener), 1);
          },
        };

        reslove(connection);
      } else {
        listeners
          .filter(({ opcode }) => opcode === message.op)
          .forEach((it) => it.handler(message.d));
      }
    });

    socket.addEventListener("open", () => {
      const id = setInterval(() => {
        if (socket.readyState === socket.CLOSED) {
          clearInterval(id);
        } else {
          socket.send("ping");
          logger("out", "ping");
        }
      }, heartbeatInterval);

      apiSend("auth", {
        accessToken: token,
        refreshToken,
        ...getAuthOptions?.(),
      });
    });
  });
