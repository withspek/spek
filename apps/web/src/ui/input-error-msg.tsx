import React from "react";

interface InputErrorMsgProps {
  children?: React.ReactNode;
}

export const InputErrorMsg: React.FC<InputErrorMsgProps> = ({ children }) => {
  return <div className={`flex text-secondary-400`}>{children}</div>;
};
