import ConnectionContext from "@/contexts/ConnectionContext";
import { useTokenStore } from "@/stores/useTokenStore";
import { Await } from "@/utils/util-types";
import { wrap } from "@spek/client";
import { useContext } from "react";
import { UseMutationOptions, useMutation } from "react-query";

type Keys = keyof ReturnType<typeof wrap>["mutation"];

export const useTypeSafeMutation = <K extends Keys>(
  key: K,
  opts?: UseMutationOptions<
    Await<ReturnType<ReturnType<typeof wrap>["mutation"][K]>>,
    any,
    Parameters<ReturnType<typeof wrap>["mutation"][K]>,
    any
  >
) => {
  const { conn } = useContext(ConnectionContext);

  return useMutation<
    Await<ReturnType<ReturnType<typeof wrap>["mutation"][K]>>,
    any,
    Parameters<ReturnType<typeof wrap>["mutation"][K]>
  >(async (params) => {
    const resp = await (
      wrap(conn!).mutation[typeof key === "string" ? key : key[0]] as any
    )(...params);
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
  }, opts);
};
