import { UserPreviewContext } from "@/contexts/UserPreviewContext";
import { useConn } from "@/hooks/useConn";
import { useCurrentConfInfo } from "@/hooks/useCurrentConfInfo";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Conf, ConfUser } from "@spek/client";
import { Button, Dialog, DialogContent, UserAvatar } from "@spek/ui";
import { useContext } from "react";
import { CenterLoader } from "../CenterLoader";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";

interface Props {
  conf: Conf;
  users: ConfUser[];
}

const UserPreview: React.FC<{
  id: string;
  isMod: boolean;
  isCreator: boolean;
  iAmCreator: boolean;
  isMe: boolean;
  confPermissions: ConfUser["conf_permissions"];
  onClose: () => void;
}> = ({ id, confPermissions, isCreator, iAmCreator, isMe, isMod, onClose }) => {
  const { mutateAsync: setListener } = useTypeSafeMutation("setListener");
  const { mutateAsync: addSpeaker } = useTypeSafeMutation("addSpeaker");
  const { data, isLoading } = useTypeSafeQuery(["getUserProfile", id], {}, [
    id,
  ]);

  if (isLoading) {
    return <CenterLoader />;
  }

  if (!data) {
    return (
      <div
        className={`flex p-6 text-center items-center justify-center w-full font-bold text-primary-100`}
      >
        The user is available.
      </div>
    );
  }

  const canDoModOnThisUser =
    !isMe &&
    (iAmCreator || isMod) &&
    !isCreator &&
    (!confPermissions?.is_mod || iAmCreator);

  // [shouldShow, key, onClick, text]
  const buttonData = [
    [
      canDoModOnThisUser &&
        confPermissions?.asked_to_speak &&
        !confPermissions.is_speaker,
      "addAsSpeakerButton",
      () => {
        onClose();
        addSpeaker([id]);
      },
      "Make a speaker",
    ],
    [
      canDoModOnThisUser && confPermissions?.is_speaker,
      "makeAListener",
      () => {
        onClose();
        setListener([id]);
      },
      "Make a listener",
    ],
  ] as const;

  return (
    <div className="flex flex-col gap-2 px-2 py-4">
      <div className="flex flex-col justify-center items-center">
        <UserAvatar user={data.user} online={data.user.online} size="lg" />
        <p className="font-semibold">{data.user.displayName}</p>
        <p className="text-sm">@{data.user.username}</p>
      </div>
      <p className="text-balance text-center">{data.user.bio}</p>
      <div className="flex flex-col gap-4">
        {buttonData.map(([showButton, key, onClick, text]) => {
          return showButton ? (
            <Button key={key} onClick={onClick}>
              {text}
            </Button>
          ) : null;
        })}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export const RoomUserPreviewModal: React.FC<Props> = ({ conf, users }) => {
  const { data, setData } = useContext(UserPreviewContext);
  const { isCreator: iAmCreator, isMod } = useCurrentConfInfo();
  const conn = useConn();

  return (
    <Dialog
      open={!!data?.userId}
      onOpenChange={() => setData({ userId: null })}
    >
      <DialogContent>
        {!data?.userId ? null : (
          <UserPreview
            id={data.userId}
            iAmCreator={iAmCreator}
            isCreator={conf.creator_id === data?.userId}
            confPermissions={
              users.find((u) => u.id == data?.userId)?.conf_permissions
            }
            onClose={() => setData({ userId: null })}
            isMe={conn.user.id === data?.userId}
            isMod={isMod}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
