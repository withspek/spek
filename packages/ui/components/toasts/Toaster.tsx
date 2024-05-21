import React from "react";
import { Toaster as Toast, type ToastT } from "sonner";

export const Toaster: React.FC<ToastT> = (props) => {
  return <Toast {...props} />;
};
