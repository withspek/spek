import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { User, websocket } from "@spek/client";
import { API_URL } from "@spek/lib/constants";

import { useTokenStore } from "@/stores/useTokenStore";
import { useVoiceStore } from "@/webrtc/stores/useVoiceStore";
import { useCurrentConfIdStore } from "@/stores/useCurentConfIdStore";
import { useMuteStore } from "@/stores/useMuteStore";
import { useDeafStore } from "@/stores/useDeafStore";
import { closeVoiceConnections } from "@/webrtc/WebRTC";

interface WebSocketProviderProps {
  children: React.ReactNode;
}

type V = websocket.WSConnection | null;

export const WebSocketContext = React.createContext<{
  conn: V;
  setUser: (u: User) => void;
  setConn: (u: websocket.WSConnection | null) => void;
}>({
  conn: null,
  setUser: () => {},
  setConn: () => {},
});

export default WebSocketContext;

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [conn, setConn] = useState<V>(null);
  const { replace } = useRouter();
  const isConnecting = useRef(false);

  useEffect(() => {
    if (!conn && !isConnecting.current) {
      isConnecting.current = true;
      websocket
        .connect("", "", {
          url: API_URL.replace("http", "ws") + "/ws",
          getAuthOptions: () => {
            const { accessToken, refreshToken } = useTokenStore.getState();
            const { recvTransport, sendTransport } = useVoiceStore.getState();

            const reconnectToVoice = !recvTransport
              ? true
              : recvTransport.connectionState !== "connected" ||
                sendTransport?.connectionState !== "connected";

            console.log({
              reconnectToVoice,
              recvState: recvTransport?.connectionState,
              sendState: sendTransport?.connectionState,
            });

            return {
              accessToken,
              refreshToken,
              reconnectToVoice,
              currentConfId: useCurrentConfIdStore.getState().currentConfId,
              muted: useMuteStore.getState().muted,
              deafened: useDeafStore.getState().deafened,
            };
          },
          onConnectionTaken: () => {
            closeVoiceConnections(null);
            useCurrentConfIdStore.getState().setCurrentConfId(null);
            // the index page nulls the conn
            // if you switch this, make sure to null the conn at the new location
            replace("/");
            // TODO: do something better
          },
          onClearTokens: () => {
            console.log("clearing tokens...");
            useTokenStore
              .getState()
              .setTokens({ accessToken: "", refreshToken: "" });
            closeVoiceConnections(null);
            useCurrentConfIdStore.getState().setCurrentConfId(null);
            setConn(null);
            replace("/logout");
          },
        })
        .then((x) => {
          setConn(x);
          if (x.user.current_conf_id) {
            useCurrentConfIdStore
              .getState()
              // if an id exists already, that means they are trying to join another conference
              // just let them join the other conference rather than overwriting it
              .setCurrentConfId((id) => id || x.user.current_conf_id!);
          }
        })
        .catch((err) => {
          if (err.code === 4001) {
            replace(`/?next=${window.location.pathname}`);
          }
        })
        .finally(() => {
          isConnecting.current = false;
        });
    }
  }, [conn, replace]);

  useEffect(() => {
    if (!conn) {
      return;
    }

    return conn.addListener<{
      refreshToken: string;
      accessToken: string;
    }>("new-tokens", ({ refreshToken, accessToken }) => {
      useTokenStore.getState().setTokens({
        accessToken,
        refreshToken,
      });
    });
  }, [conn]);

  return (
    <WebSocketContext.Provider
      value={useMemo(
        () => ({
          conn,
          setConn,
          setUser: (u: User) => {
            if (conn) {
              setConn({
                ...conn,
                user: u,
              });
            }
          },
        }),
        [conn]
      )}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
