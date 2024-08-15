import { websocket } from "@spek/client";
import { useWrappedConn } from "./useConn";
import { useMuteStore } from "@/stores/useMuteStore";

export const useSetMute = () => {
  const conn = useWrappedConn();
  const { setInternalMute } = useMuteStore();
  return (mute: boolean) => {
    setInternalMute(mute);
    conn.mutation.setMute(mute);
  };
};

export const setMute = (conn: websocket.Wrapper, value: boolean) => {
  useMuteStore.getState().setInternalMute(value);
  conn.mutation.setMute(value);
};
