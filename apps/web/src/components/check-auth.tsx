import React from "react";

interface CheckAuthProps {
  children?: React.ReactNode;
}

export const CheckAuth: React.FC<CheckAuthProps> = ({ children }) => {
  return <>{children}</>;
};
