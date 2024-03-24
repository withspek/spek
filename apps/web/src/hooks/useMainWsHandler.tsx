import { WebSocketContext } from "@/contexts/WebSocketContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useTypeSafeUpdateQuery } from "./useTypeSafeUpdateQuery";

export const useMainWsHandler = () => {
  const { push } = useRouter();
  const { conn } = useContext(WebSocketContext);
  const updateQuery = useTypeSafeUpdateQuery();

  useEffect(() => {
    if (!conn) {
      return;
    }

    const unsubs = [
      conn.addListener<any>("new_details", () => {}),
      conn.addListener<any>(
        "new_community_join",
        ({ communityId, success }) => {
          if (success) {
            updateQuery(["getCommunityPermissions", communityId], () => ({
              isAdmin: false,
              isBlocked: false,
              isMember: true,
              isMod: false,
            }));
          }
        }
      ),

      conn.addListener<any>("new_thread_message", ({ threadId, message }) => {
        updateQuery(["getThreadMessages", threadId], (x) => [...x, message]);
      }),
    ];

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
