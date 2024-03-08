import React from "react";

interface InputErrorMsgProps {
  children?: React.ReactNode;
}

export const InputErrorMsg: React.FC<InputErrorMsgProps> = ({ children }) => {
  return <div className={`flex text-alabaster-950`}>{children}</div>;
};
