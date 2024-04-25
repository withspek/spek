"use client";

import { ConfirmModal } from "@/components/ConfirmModal";
import { WebSocketWrapper } from "@/components/WebSocketWrapper";
import { WaitForConn } from "@/components/check-auth";
import { ConnnectionContextProvider } from "@/contexts/ConnectionContext";
import { queryClient } from "@/utils/queryClient";
import ReactModal from "react-modal";
import { QueryClientProvider } from "react-query";

interface Props {
  children?: React.ReactNode;
}

ReactModal.setAppElement("body");

export const Providers: React.FC<Props> = ({ children }) => {
  return (
    <>
      <ConnnectionContextProvider>
        <QueryClientProvider client={queryClient}>
          <WaitForConn>
            <WebSocketWrapper>
              {children}
              <ConfirmModal />
            </WebSocketWrapper>
          </WaitForConn>
        </QueryClientProvider>
      </ConnnectionContextProvider>
    </>
  );
};
