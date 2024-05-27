"use client";

import ConnectionContext from "@/contexts/ConnectionContext";
import { useVerifyLoggedIn } from "@/hooks/useVerifyLoggedIn";
import React, { useContext } from "react";
import { CenterLoader } from "./CenterLoader";
import { Spinner } from "@spek/ui";

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
    return (
      <div className="flex w-full h-full justify-center items-center">
        <Spinner className="h-9 w-9" />
      </div>
    );
  }

  return <>{children}</>;
};
