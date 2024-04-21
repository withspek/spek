import React, { useEffect, useMemo, useState } from "react";

import { User, raw } from "@spek/client";
import { apiUrl } from "@/utils/constants";
import { useTokenStore } from "@/stores/useTokenStore";

type V = raw.Connection | null;

export const ConnectionContext = React.createContext<{
  conn: V;
  setUser: (u: User) => void;
  setConn: (u: raw.Connection | null) => void;
}>({
  conn: null,
  setUser: () => {},
  setConn: () => {},
});

export default ConnectionContext;

interface ConnectionContextProviderProps {
  children: React.ReactNode;
}

export const ConnnectionContextProvider: React.FC<
  ConnectionContextProviderProps
> = ({ children }) => {
  const [conn, setConn] = useState<V>(null);
  const tokens = useTokenStore.getState();

  useEffect(() => {
    if (!conn) {
      raw
        .connect(tokens.accessToken, tokens.refreshToken, {
          url: apiUrl,
        })
        .then((x) => {
          setConn(x);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [conn, tokens]);

  return (
    <ConnectionContext.Provider
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
    </ConnectionContext.Provider>
  );
};
