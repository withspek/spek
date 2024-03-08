"use client";

import ConnectionContext from "@/contexts/ConnectionContext";
import { useTokenStore } from "@/stores/useTokenStore";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";

interface CheckAuthProps {
  children?: React.ReactNode;
}

export const CheckAuth: React.FC<CheckAuthProps> = ({ children }) => {
  const { conn } = useContext(ConnectionContext);
  const { replace } = useRouter();
  const pathname = usePathname();
  const hasTokens = useTokenStore((s) => !!(s.accessToken && s.refreshToken));

  useEffect(() => {
    if ((!hasTokens && !conn?.user) || (hasTokens && !conn?.user)) {
      replace(`/?next=${pathname}`);
    }
  }, [hasTokens, conn, pathname, replace]);

  return <>{children}</>;
};

export const WaitForConn: React.FC<CheckAuthProps> = ({ children }) => {
  const { conn } = useContext(ConnectionContext);

  if (!conn) {
    // @todo make this better
    return <div className="flex">loading...</div>;
  }

  return <>{children}</>;
};
