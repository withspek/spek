import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { API_URL } from "@spek/lib/constants";
import { http } from "@spek/client";

import { useTokenStore } from "@/stores/useTokenStore";

type V = http.raw.Connection | null;

export const DataFetchingContext = React.createContext<{
  conn: V;
  setConn: (u: http.raw.Connection | null) => void;
}>({
  conn: null,
  setConn: () => {},
});

export default DataFetchingContext;

interface DataFetchingContextProviderProps {
  children: React.ReactNode;
}

const WaitForConnection: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { conn } = useContext(DataFetchingContext);

  if (!conn) {
    return null;
  }

  return <>{children}</>;
};

export const DataFetchingContextProvider: React.FC<
  DataFetchingContextProviderProps
> = ({ children }) => {
  const [conn, setConn] = useState<V>(null);
  const tokens = useTokenStore.getState();
  const isConnecting = useRef(false);

  useEffect(() => {
    if (!conn && !isConnecting.current) {
      isConnecting.current = true;

      http.raw
        .connect(tokens.accessToken, tokens.refreshToken, {
          url: API_URL,
        })
        .then((x) => {
          setConn(x);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          isConnecting.current = false;
        });
    }
  }, [conn, tokens]);

  useEffect(() => {
    if (!conn) {
      return;
    }
  }, [conn]);

  return (
    <DataFetchingContext.Provider
      value={useMemo(
        () => ({
          conn,
          setConn,
        }),
        [conn]
      )}
    >
      <WaitForConnection>{children}</WaitForConnection>
    </DataFetchingContext.Provider>
  );
};
