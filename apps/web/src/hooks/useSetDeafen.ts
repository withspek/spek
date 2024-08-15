import { websocket } from "@spek/client";
import { useWrappedConn } from "./useConn";
import { useDeafStore } from "@/stores/useDeafStore";

export const useSetDeafen = () => {
  const conn = useWrappedConn();
  const { setInternalDeaf } = useDeafStore();
  return (deafen: boolean) => {
    setInternalDeaf(deafen);
    conn.mutation.setDeafen(deafen);
  };
};

export const setDeafen = (conn: websocket.Wrapper, value: boolean) => {
  useDeafStore.getState().setInternalDeaf(value);
  conn.mutation.setDeafen(value);
};
