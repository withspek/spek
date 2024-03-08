import ConnectionContext from "@/contexts/ConnectionContext";
import { wrap } from "@spek/client";
import { useContext } from "react";

export const useConn = () => {
  return useContext(ConnectionContext).conn!;
};

export const useWrappedConn = () => {
  return wrap(useContext(ConnectionContext).conn!);
};
