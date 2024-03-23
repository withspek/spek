"use client";

import ConnectionContext from "@/contexts/ConnectionContext";
import { useVerifyLoggedIn } from "@/hooks/useVerifyLoggedIn";
import React, { useContext } from "react";

interface AuthenticatedProps {
  children?: React.ReactNode;
}

export const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  if (!useVerifyLoggedIn()) {
    return null;
  }

  return <>{children}</>;
};

export const WaitForConn: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { conn } = useContext(ConnectionContext);

  if (!conn) {
    // @todo make this better
    return <div className="flex">loading...</div>;
  }

  return <>{children}</>;
};
