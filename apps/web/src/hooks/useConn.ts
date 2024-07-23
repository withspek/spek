import { websocket } from "@spek/client";
import { useContext } from "react";

import WebSocketContext from "@/contexts/WebSocketContext";

export const useConn = () => {
  return useContext(WebSocketContext).conn!;
};

export const useWrappedConn = () => {
  return websocket.wrap(useContext(WebSocketContext).conn!);
};
