import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { useConn } from "@/hooks/useConn";
import { MainWsHandlerProvider } from "@/hooks/useMainWsHandler";

interface Props {
  children: React.ReactNode;
}

export const WebSocketWrapper: React.FC<Props> = ({ children }) => {
  const { user } = useConn();

  return (
    <WebSocketProvider shouldConnect={user ? true : false}>
      <MainWsHandlerProvider>{children}</MainWsHandlerProvider>
    </WebSocketProvider>
  );
};
