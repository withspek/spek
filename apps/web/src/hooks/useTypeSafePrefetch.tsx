import { useCallback, useContext } from "react";
import { useQueryClient } from "react-query";
import { wrap } from "@spek/client";

import { useWrappedConn } from "./useConn";
import { useTokenStore } from "@/stores/useTokenStore";

type Keys = keyof ReturnType<typeof wrap>["query"];

type PaginatedKey<K extends Keys> = [K, string | number];

export const useTypeSafePrefetch = () => {
  const conn = useWrappedConn();
  const client = useQueryClient();

  return useCallback(
    <K extends Keys>(
      key: K | PaginatedKey<K>,
      params?: Parameters<ReturnType<typeof wrap>["query"][K]>
    ) =>
      client.prefetchQuery(
        key,
        async () => {
          const fn = conn!.query[typeof key === "string" ? key : key[0]] as any;
          return await fn(...(params || []));
        },
        { staleTime: 0 }
      ),
    [conn, client]
  );
};
