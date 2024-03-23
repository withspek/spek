import { WebSocketContext } from "@/contexts/WebSocketContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export const useMainWsHandler = () => {
  const { push } = useRouter();
  const { conn } = useContext(WebSocketContext);

  useEffect(() => {
    if (!conn) {
      return;
    }

    const unsubs = [conn.addListener<any>("new_details", () => {})];

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [conn, push]);
};

export const MainWsHandlerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  useMainWsHandler();

  return <>{children}</>;
};
