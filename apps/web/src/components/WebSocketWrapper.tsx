import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { MainWsHandlerProvider } from "@/hooks/useMainWsHandler";
import { useTokenStore } from "@/stores/useTokenStore";

interface Props {
  children: React.ReactNode;
}

export const WebSocketWrapper: React.FC<Props> = ({ children }) => {
  const hasTokens = useTokenStore((s) => !!(s.accessToken && s.refreshToken));

  return (
    <WebSocketProvider shouldConnect={hasTokens}>
      <MainWsHandlerProvider>{children}</MainWsHandlerProvider>
    </WebSocketProvider>
  );
};
