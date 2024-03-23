import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { useConn } from "@/hooks/useConn";

interface Props {
  children: React.ReactNode;
}

export const WebSocketWrapper: React.FC<Props> = ({ children }) => {
  const { user } = useConn();

  return (
    <WebSocketProvider shouldConnect={user ? true : false}>
      {children}
    </WebSocketProvider>
  );
};
