import { WebSocketContext } from "@/contexts/WebSocketContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useTypeSafeUpdateQuery } from "./useTypeSafeUpdateQuery";
import { showToast } from "@spek/ui";
import { useSetMute } from "./useSetMute";
import { mergeConfPermissions } from "@/webrtc/utils/mergeConfPermission";

export const useMainWsHandler = () => {
  const { push } = useRouter();
  const { conn } = useContext(WebSocketContext);
  const setMute = useSetMute();
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

      conn.addListener<any>(
        "delete_thread_message",
        ({ messageId, cursor }) => {
          updateQuery(["getThreadMessages", cursor], (x) => ({
            messages: x.messages.filter((m) => m.id !== messageId),
            nextCursor: x.nextCursor,
          }));
        }
      ),

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

      conn.addListener<any>("speaker_added", ({ userId, confId, muteMap }) => {
        // Mute user upon added as speaker
        if (conn.user.id == userId) {
          setMute(true);
        }

        updateQuery(["joinConfAndGetInfo", confId], (data) =>
          !data || "error" in data
            ? data
            : {
                ...data,
                muteMap,
                users: data.users.map((u) =>
                  u.id === userId
                    ? {
                        ...u,
                        conf_permissions: mergeConfPermissions(
                          u.conf_permissions,
                          { is_speaker: true }
                        ),
                      }
                    : u
                ),
              }
        );
      }),

      conn.addListener<any>(
        "speaker_removed",
        ({ userId, confId, muteMap }) => {
          updateQuery(["joinConfAndGetInfo", confId], (data) =>
            !data || "error" in data
              ? data
              : {
                  ...data,
                  muteMap,
                  users: data.users.map((u) =>
                    u.id === userId
                      ? {
                          ...u,
                          conf_permissions: mergeConfPermissions(
                            u.conf_permissions,
                            { is_speaker: false, asked_to_speak: false }
                          ),
                        }
                      : u
                  ),
                }
          );
        }
      ),

      conn.addListener<any>("hand_raised", ({ userId, confId }) => {
        updateQuery(["joinConfAndGetInfo", confId], (data) =>
          !data || "error" in data
            ? data
            : {
                ...data,
                users: data.users.map((u) =>
                  u.id === userId
                    ? {
                        ...u,
                        conf_permissions: mergeConfPermissions(
                          u.conf_permissions,
                          { asked_to_speak: true }
                        ),
                      }
                    : u
                ),
              }
        );
      }),

      conn.addListener<any>("mute_changed", ({ userId, value, confId }) => {
        updateQuery(["joinConfAndGetInfo", confId], (data) => {
          if (data && "error" in data) {
            return data;
          }

          let muteMap = data.muteMap;

          if (value) {
            muteMap = { ...data.muteMap, [userId]: true };
          } else {
            const { [userId]: _, ...newMuteMap } = data.muteMap;
            muteMap = newMuteMap;
          }

          return {
            ...data,
            muteMap,
          };
        });
      }),
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
