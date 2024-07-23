import { http } from "@spek/client";
import { useContext } from "react";
import { UseMutationOptions, useMutation } from "react-query";

import DataFetchingContext from "@/contexts/DataFetchingContext";
import { Await } from "@/utils/util-types";

type Keys = keyof ReturnType<typeof http.wrap>["mutation"];

export const useTypeSafeMutation = <K extends Keys>(
  key: K,
  opts?: UseMutationOptions<
    Await<ReturnType<ReturnType<typeof http.wrap>["mutation"][K]>>,
    any,
    Parameters<ReturnType<typeof http.wrap>["mutation"][K]>,
    any
  >
) => {
  const { conn } = useContext(DataFetchingContext);

  return useMutation<
    Await<ReturnType<ReturnType<typeof http.wrap>["mutation"][K]>>,
    any,
    Parameters<ReturnType<typeof http.wrap>["mutation"][K]>
  >(
    async (params) =>
      await (
        http.wrap(conn!).mutation[typeof key === "string" ? key : key[0]] as any
      )(...params),
    opts
  );
};
