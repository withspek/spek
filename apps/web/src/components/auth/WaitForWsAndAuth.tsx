"use client";

import { Spinner } from "@spek/ui";
import React, { useContext, useEffect, useState } from "react";

import WebSocketContext from "@/contexts/WebSocketContext";

interface WaitForWsAndAuthProps {
  children: React.ReactNode;
}

export const WaitForWsAndAuth: React.FC<WaitForWsAndAuthProps> = ({
  children,
}) => {
  const { conn } = useContext(WebSocketContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!conn) {
    return isClient ? (
      <div className="flex w-full h-full justify-center items-center">
        <Spinner className="h-9 w-9" />
      </div>
    ) : null;
  }

  return <>{children}</>;
};
