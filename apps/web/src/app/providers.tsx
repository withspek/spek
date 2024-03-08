"use client";

import { WaitForConn } from "@/components/check-auth";
import { ConnnectionContextProvider } from "@/contexts/ConnectionContext";
import { queryClient } from "@/utils/queryClient";
import { QueryClientProvider } from "react-query";

interface Props {
  children?: React.ReactNode;
}

export const Providers: React.FC<Props> = ({ children }) => {
  return (
    <>
      <ConnnectionContextProvider>
        <QueryClientProvider client={queryClient}>
          <WaitForConn>{children}</WaitForConn>
        </QueryClientProvider>
      </ConnnectionContextProvider>
    </>
  );
};
