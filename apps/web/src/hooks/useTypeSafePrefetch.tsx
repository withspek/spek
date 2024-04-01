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
          const resp = await fn(...(params || []));

          // TODO: remove get and setting token store here
          const _accessToken = resp.headers.get("access-token");
          const _refreshToken = resp.headers.get("refresh-token");

          if (_accessToken && _refreshToken) {
            useTokenStore.getState().setTokens({
              accessToken: _accessToken,
              refreshToken: _refreshToken,
            });
          }

          return resp.json();
        },

        { staleTime: 0 }
      ),
    [conn, client]
  );
};
