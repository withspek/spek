import { useContext } from "react";
import { useCurrentConfFromCache } from "./useCurrentConfFromCache";
import WebSocketContext from "@/contexts/WebSocketContext";

export const useCurrentConfInfo = () => {
  const data = useCurrentConfFromCache();
  const { conn } = useContext(WebSocketContext);

  if (!data || !conn || "error" in data) {
    return {
      isMod: false,
      isCreator: false,
      isSpeaker: false,
      canSpeak: false,
    };
  }

  let isMod = false;
  let isSpeaker = false;
  let canIAskToSpeak = false;

  const me = conn.user;

  const isCreator = me.id == data.conf.creator_id;

  const { users } = data;

  for (const u of users) {
    if (u.id == me.id) {
      if (u.conf_permissions?.is_speaker) {
        isSpeaker = true;
      }

      if (u.conf_permissions?.is_mod) {
        isMod = true;
      }

      canIAskToSpeak =
        !u.conf_permissions?.asked_to_speak && !isCreator && !isSpeaker;
      break;
    }
  }

  return {
    isCreator,
    isMod,
    isSpeaker,
    canIAskToSpeak,
    canSpeak: isCreator || isSpeaker,
  };
};
