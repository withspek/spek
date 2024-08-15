import { WebSocketContext } from "@/contexts/WebSocketContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useTypeSafeUpdateQuery } from "./useTypeSafeUpdateQuery";
import { showToast } from "@spek/ui";

export const useMainWsHandler = () => {
  const { push } = useRouter();
  const { conn } = useContext(WebSocketContext);
  const updateQuery = useTypeSafeUpdateQuery();

  useEffect(() => {
    if (!conn) {
      return;
    }

    const unsubs = [
      conn.addListener<any>("error", (message) => {
        showToast(message, "error");
      }),
      conn.addListener<any>("profile_update", ({ user }) => {
        updateQuery(["getUserProfile", user.id], () => ({
          user: {
            ...user,
          },
        }));
      }),
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

      conn.addListener<any>("new_thread_message", ({ message }) => {
        updateQuery(["getThreadMessages", 0], (x) => ({
          messages: [message, ...x.messages],
          nextCursor: x.nextCursor,
        }));
      }),

      conn.addListener<any>("new_lodge_message", ({ message }) => {
        updateQuery(["getLodgeMessages", 0], (x) => ({
          messages: [message, ...x.messages],
          initial: x.initial,
          nextCursor: x.nextCursor,
        }));
      }),

      conn.addListener<any>(
        "new_user_join_conf",
        ({ user, muteMap, confId }) => {
          updateQuery(["joinConfAndGetInfo", confId], (data) =>
            !data || "error" in data
              ? data
              : {
                  ...data,
                  muteMap,
                  conf: {
                    ...data.conf,
                    peoplePreviewList:
                      data.conf.people_preview_list.length < 10
                        ? [
                            ...data.conf.people_preview_list,
                            {
                              id: user.id,
                              displayName: user.displayName,
                              avatarUrl: user.avatarUrl,
                              username: user.username,
                              bio: user.bio,
                            },
                          ]
                        : data.conf.people_preview_list,
                    numPeopleInside: data.conf.num_people_inside + 1,
                  },
                  users: [...data.users.filter((x) => x.id !== user.id), user],
                }
          );
        }
      ),

      conn.addListener<any>(
        "active_speaker_change",
        ({ confId, activeSpeakerMap }) => {
          updateQuery(["joinConfAndGetInfo", confId], (data) =>
            !data || "error" in data
              ? data
              : {
                  ...data,
                  activeSpeakerMap,
                }
          );
        }
      ),
    ];

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [conn, push, updateQuery]);
};

export const MainWsHandlerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  useMainWsHandler();

  return <>{children}</>;
};
