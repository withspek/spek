"use client";

import ReactModal from "react-modal";
import { TooltipProvider, Toaster } from "@spek/ui";
import { QueryClientProvider } from "react-query";

import { ConfirmModal } from "@/components/ConfirmModal";
import { DataFetchingContextProvider } from "@/contexts/DataFetchingContext";
import { queryClient } from "@/utils/queryClient";
import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";
import { useTokenStore } from "@/stores/useTokenStore";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { MainWsHandlerProvider } from "@/hooks/useMainWsHandler";

interface Props {
  children?: React.ReactNode;
}

ReactModal.setAppElement("body");

export const Providers: React.FC<Props> = ({ children }) => {
  const hasTokens = useTokenStore((s) => !!(s.accessToken && s.refreshToken));

  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider shouldConnect={hasTokens}>
        <WaitForWsAndAuth>
          <DataFetchingContextProvider>
            <MainWsHandlerProvider>
              <TooltipProvider>
                {children}
                <ConfirmModal />
                <Toaster id={"toaster"} />
              </TooltipProvider>
            </MainWsHandlerProvider>
          </DataFetchingContextProvider>
        </WaitForWsAndAuth>
      </WebSocketProvider>
    </QueryClientProvider>
  );
};
