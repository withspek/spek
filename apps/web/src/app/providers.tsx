"use client";

import { AuthContextProvider } from "@/contexts/AuthContext";
import { ConnnectionContextProvider } from "@/contexts/ConnectionContext";
import { queryClient } from "@/utils/queryClient";
import { QueryClientProvider } from "react-query";

interface Props {
  children?: React.ReactNode;
}

export const Providers: React.FC<Props> = ({ children }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ConnnectionContextProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </ConnnectionContextProvider>
      </QueryClientProvider>
    </>
  );
};
