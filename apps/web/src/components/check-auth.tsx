"use client";

import AuthContext from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";

interface CheckAuthProps {
  children?: React.ReactNode;
}

export const CheckAuth: React.FC<CheckAuthProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { push } = useRouter();

  useEffect(() => {
    if (!user) {
      push("/login");
    }
  }, [user]);
  return <>{children}</>;
};
