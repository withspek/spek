import { useCallback } from "react";
import { useQueryClient } from "react-query";
import { http } from "@spek/client";

import { useWrappedFetch } from "./useFetch";

type Keys = keyof ReturnType<typeof http.wrap>["query"];

type PaginatedKey<K extends Keys> = [K, string | number];

export const useTypeSafePrefetch = () => {
  const conn = useWrappedFetch();
  const client = useQueryClient();

  return useCallback(
    <K extends Keys>(
      key: K | PaginatedKey<K>,
      params?: Parameters<ReturnType<typeof http.wrap>["query"][K]>
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
