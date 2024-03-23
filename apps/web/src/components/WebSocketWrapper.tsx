import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { useConn } from "@/hooks/useConn";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export const WebSocketWrapper: React.FC<Props> = ({ children }) => {
  const { user } = useConn();

  return <WebSocketProvider shouldConnect={true}>{children}</WebSocketProvider>;
};
