import { http } from "@spek/client";
import { UseQueryOptions, useQuery } from "react-query";

import { Await } from "@/utils/util-types";
import { useWrappedFetch } from "./useFetch";

type Keys = keyof ReturnType<typeof http.wrap>["query"];
type PaginatedKey<K extends Keys> = [K, ...(string | number | boolean)[]];

export const useTypeSafeQuery = <K extends Keys>(
  key: K | PaginatedKey<K>,
  opts?: UseQueryOptions,
  params?: Parameters<ReturnType<typeof http.wrap>["query"][K]>
) => {
  const conn = useWrappedFetch();

  return useQuery<Await<ReturnType<ReturnType<typeof http.wrap>["query"][K]>>>(
    key,
    async () => {
      const fn = conn!.query[typeof key === "string" ? key : key[0]] as any;
      return await fn(...(params || []));
    },
    {
      enabled: !!conn,
      ...opts,
    } as any
  );
};
