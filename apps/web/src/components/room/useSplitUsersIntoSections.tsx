import { useConn } from "@/hooks/useConn";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { useDeafStore } from "@/stores/useDeafStore";
import { useMuteStore } from "@/stores/useMuteStore";
import { Conf, ConfUser } from "@spek/client";
import { Icon, UserAvatar } from "@spek/ui";
import { confirmModal } from "../ConfirmModal";
import { useContext } from "react";
import { UserPreviewContext } from "@/contexts/UserPreviewContext";

interface Props {
  conf: Conf;
  users: ConfUser[];
  activeSpeakerMap: Record<string, boolean>;
  muteMap: Record<string, boolean>;
  deafMap: Record<string, boolean>;
}

export const useSplitUsersIntoSections = ({
  activeSpeakerMap,
  conf,
  deafMap,
  muteMap,
  users,
}: Props) => {
  const conn = useConn();
  const { muted } = useMuteStore();
  const { deafened } = useDeafStore();
  const { mutateAsync: askToSpeak } = useTypeSafeMutation("askToSpeak");
  const { setData } = useContext(UserPreviewContext);
  const speakers: React.ReactNode[] = [];
  const askingToSpeak: React.ReactNode[] = [];
  const listeners: React.ReactNode[] = [];
  let canIAskToSpeak = false;

  users.forEach((u) => {
    let arr = listeners;
    if (u.id === conf.creator_id || u.conf_permissions?.is_speaker) {
      arr = speakers;
    } else if (u.conf_permissions?.asked_to_speak) {
      arr = askingToSpeak;
    } else if (u.id == conn.user.id) {
      canIAskToSpeak = true;
    }

    const isCreator = u.id === conf.creator_id;
    const isSpeaker = !!u.conf_permissions?.is_speaker;
    const canSpeak = isCreator || isSpeaker;
    const isMuted = conn.user.id === u.id ? muted : muteMap[u.id];
    const isDeafened = conn.user.id === u.id ? deafened : deafMap[u.id];

    arr.push(
      <div
        key={u.id}
        className="flex flex-col items-center"
        onClick={() => {
          setData({ userId: u.id });
        }}
      >
        <UserAvatar
          activeSpeaker={
            canSpeak && !isMuted && !isDeafened && u.id in activeSpeakerMap
          }
          size="lg"
          user={u}
        />
        <p>{u.username}</p>
      </div>
    );
  });

  if (canIAskToSpeak) {
    speakers.push(
      <div
        className="flex justify-center items-center h-10 w-10 rounded-md cursor-pointer bg-primary-900"
        onClick={async () => {
          confirmModal("Would you like to ask to speak?", async () => {
            await askToSpeak([]);
          });
        }}
      >
        <Icon name="megaphone" />
      </div>
    );
  }

  return {
    listeners,
    speakers,
    canIAskToSpeak,
    askingToSpeak,
  };
};
