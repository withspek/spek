import { Await } from "@/utils/util-types";
import { wrap } from "@spek/client";
import { UseQueryOptions, useQuery } from "react-query";
import { useWrappedConn } from "./useConn";
import { useTokenStore } from "@/stores/useTokenStore";

type Keys = keyof ReturnType<typeof wrap>["query"];
type PaginatedKey<K extends Keys> = [K, ...(string | number | boolean)[]];

export const useTypeSafeQuery = <K extends Keys>(
  key: K | PaginatedKey<K>,
  opts?: UseQueryOptions,
  params?: Parameters<ReturnType<typeof wrap>["query"][K]>
) => {
  const conn = useWrappedConn();

  return useQuery<Await<ReturnType<ReturnType<typeof wrap>["query"][K]>>>(
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
    {
      enabled: !!conn,
      ...opts,
    } as any
  );
};
