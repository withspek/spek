import { Avatar, Icon, showToast } from "@spek/ui";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Thread, Message as ThreadMessage } from "@spek/client";

import { useConn } from "@/hooks/useConn";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { markdown } from "@/utils/markdown";
import { EditThreadMessageModal } from "./EditThreadMessageModal";
import { confirmModal } from "../ConfirmModal";
import { ApiPreloadLink } from "../ApiPreloadLink";

interface Props {
  message: ThreadMessage;
  currentThread: Thread;
  currentCursor: number;
}

export const Message: React.FC<Props> = ({
  message,
  currentCursor,
  currentThread,
}) => {
  const { user } = useConn();
  const dt = useMemo(
    () => new Date(message.inserted_at),
    [message.inserted_at]
  );
  const [showEdit, setShowEdit] = useState(false);
  const { mutateAsync: deleteThreadMessage } = useTypeSafeMutation(
    "deleteThreadMessage"
  );
  const { mutateAsync: createThread } = useTypeSafeMutation(
    "createThreadFromMessage"
  );
  const { push } = useRouter();

  const handleShowEdit = () => {
    setShowEdit(!showEdit);
  };

  return (
    <div
      className={`group relative hover:bg-primary-900 cursor-pointer flex w-full items-start rounded-md px-2 py-1 gap-3`}
    >
      <ApiPreloadLink route="profile" data={{ id: message.user.id }}>
        <Avatar
          imageSrc={message.user.avatarUrl}
          size={"md"}
          alt={message.user.displayName}
        />
      </ApiPreloadLink>
      <div className="flex flex-col gap-1">
        <p className="font-bold text-sm">
          {message.user.displayName}
          <span className="font-normal ml-3 text-sm">
            {format(dt, "MMM dd HH:mm")}
          </span>
        </p>
        {markdown(message.text)}
      </div>
      {(user && currentThread.creator.id == user.id) ||
      (user && user.id == message.user.id) ? (
        <div className="hidden absolute group-hover:flex gap-2 py-1 px-3 border-primary-700 border bg-primary-800 -top-2 right-0 rounded-md">
          <Icon name="pencil-line" size={16} onClick={handleShowEdit} />
          <Icon
            name="git-pull-request"
            size={16}
            onClick={() => {
              confirmModal(
                `Do want to create a thread from this message?`,
                async () => {
                  const resp = await createThread([
                    {
                      channelId: currentThread.channelId,
                      communityId: currentThread.communityId,
                      messageId: message.id,
                      threadId: currentThread.id,
                    },
                  ]);

                  push(`/thread/${resp.thread.id}`);
                }
              );
            }}
          />
          <Icon
            name="trash"
            className="text-red-400"
            size={16}
            onClick={() => {
              confirmModal("Are you want to delete this message?", async () => {
                const resp: any = await deleteThreadMessage([
                  {
                    cursor: currentCursor,
                    messageId: message.id,
                    threadId: currentThread.id,
                  },
                ]);

                if (!resp.success && "error" in resp) {
                  showToast(resp.error, "error");
                }
              });
            }}
          />
        </div>
      ) : null}
      <EditThreadMessageModal isOpen={showEdit} onOpenChange={handleShowEdit} />
    </div>
  );
};
