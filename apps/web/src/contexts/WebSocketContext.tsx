import { useTokenStore } from "@/stores/useTokenStore";
import { apiUrl } from "@/utils/constants";
import { websocket } from "@spek/client";
import { WSConnection } from "@spek/client/dist/websocket";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import ConnectionContext from "./ConnectionContext";

interface WebSocketProviderProps {
  shouldConnect: boolean;
  children: React.ReactNode;
}

type V = websocket.WSConnection | null;

export const WebSocketContext = React.createContext<{
  conn: V;
  setConn: (u: WSConnection | null) => void;
}>({
  conn: null,
  setConn: () => {},
});

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  shouldConnect,
  children,
}) => {
  const hasTokens = useTokenStore((s) => s.accessToken && s.refreshToken);
  const { setUser } = useContext(ConnectionContext);
  const [conn, setConn] = useState<V>(null);
  const { replace } = useRouter();
  const isConnecting = useRef(false);

  useEffect(() => {
    if (!conn && shouldConnect && hasTokens && !isConnecting.current) {
      isConnecting.current = true;
      websocket
        .connect("", "", {
          url: apiUrl.replace("http", "ws") + "/ws",
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
            replace("/");
            useTokenStore
              .getState()
              .setTokens({ accessToken: "", refreshToken: "" });
            setConn(null);
          },
        })
        .then((x) => {
          setConn(x);
          setUser(x.user);
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
  }, [conn, shouldConnect, hasTokens, replace]);

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
        }),
        [conn]
      )}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
