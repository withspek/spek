import { useCallback, useContext } from "react";
import { useQueryClient } from "react-query";
import { wrap } from "@spek/client";

import ConnectionContext from "@/contexts/ConnectionContext";

type Keys = keyof ReturnType<typeof wrap>["query"];

type PaginatedKey<K extends Keys> = [K, string | number];

export const useTypeSafePrefetch = () => {
  const { conn } = useContext(ConnectionContext);
  const client = useQueryClient();

  return useCallback(
    <K extends Keys>(
      key: K | PaginatedKey<K>,
      params?: Parameters<ReturnType<typeof wrap>["query"][K]>
    ) =>
      client.prefetchQuery(
        key,
        () =>
          (wrap(conn!).query[typeof key === "string" ? key : key[0]] as any)(
            ...(params || [])
          ),
        { staleTime: 0 }
      ),
    [conn, client]
  );
};
