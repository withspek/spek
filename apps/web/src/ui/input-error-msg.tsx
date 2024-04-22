import React from "react";

interface InputErrorMsgProps {
  children?: React.ReactNode;
}

export const InputErrorMsg: React.FC<InputErrorMsgProps> = ({ children }) => {
  return <div className={`flex text-alabaster-100`}>{children}</div>;
};
