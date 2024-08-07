import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { User, websocket } from "@spek/client";
import { API_URL } from "@spek/lib/constants";

import { useTokenStore } from "@/stores/useTokenStore";

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

            return {
              accessToken,
              refreshToken,
            };
          },
          onConnectionTaken: () => {
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
            setConn(null);
            replace("/logout");
          },
        })
        .then((x) => {
          setConn(x);
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
