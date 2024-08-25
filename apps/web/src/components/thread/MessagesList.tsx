import { Avatar, Icon, showToast } from "@spek/ui";
import { format } from "date-fns";
import { useInView } from "react-intersection-observer";
import { Message as ThreadMessage } from "@spek/client";
import React, { useEffect, useMemo, useState } from "react";
import Markdor from "@withspek/markdor";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { ApiPreloadLink } from "../ApiPreloadLink";
import { confirmModal } from "../ConfirmModal";
import { useConn } from "@/hooks/useConn";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { useTypeSafeUpdateQuery } from "@/hooks/useTypeSafeUpdateQuery";

interface MessagesListProps {
  threadId: string;
}

interface PageProps {
  threadId: string;
  userId: string;
  cursor: number;
  onLoadMore: (cursor: number) => void;
  isLastPage: boolean;
  isOnlyPage: boolean;
}

const Message: React.FC<{
  message: ThreadMessage;
  iAmMod: boolean;
  userId: string;
  currentCursor: number;
}> = ({ message, iAmMod, userId, currentCursor }) => {
  const dt = useMemo(
    () => new Date(message.inserted_at),
    [message.inserted_at]
  );
  const { mutateAsync: deleteThreadMessage } = useTypeSafeMutation(
    "deleteThreadMessage"
  );
  const updateQuery = useTypeSafeUpdateQuery();

  return (
    <div
      className={`group relative hover:bg-primary-900 cursor-pointer flex w-full items-center rounded-md px-2 py-1 gap-3`}
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
        {Markdor.markdownToReact(message.text)}
      </div>
      {iAmMod || userId == message.user.id ? (
        <div className="hidden absolute group-hover:flex gap-2 py-1 px-3 border-primary-700 border bg-primary-800 -top-2 right-0 rounded-md">
          <Icon name="pencil-line" size={16} />
          <Icon name="plug-zap" size={16} />
          <Icon
            name="trash"
            className="text-red-400"
            size={16}
            onClick={() => {
              confirmModal("Are you want to delete this message?", async () => {
                const resp: any = await deleteThreadMessage([message.id]);

                if (!resp.success && "error" in resp) {
                  showToast(resp.error, "error");
                } else if (resp.success) {
                  updateQuery(
                    ["getThreadMessages", currentCursor],
                    (oldData) => ({
                      messages: oldData.messages.filter(
                        (m) => m.id !== resp.messageId
                      ),
                      nextCursor: oldData.nextCursor,
                    })
                  );
                }
              });
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

const Page = ({
  threadId,
  userId,
  cursor,
  isLastPage,
  isOnlyPage,
  onLoadMore,
}: PageProps) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getThreadMessages", cursor],
    { staleTime: Infinity, refetchOnMount: "always" },
    [threadId, cursor]
  );
  const { data: currentThread } = useTypeSafeQuery(
    ["joinThreadAndGetInfo", threadId],
    { enabled: false },
    [threadId]
  );

  if (isLoading) {
    return <div>loading..</div>;
  }

  if (!data) {
    return null;
  }

  if (isOnlyPage && !isLoading && !data.messages.length) {
    return <div>No messages yet</div>;
  }

  return (
    <>
      {data.messages.map((m) => (
        <Message
          key={m.id}
          message={m}
          iAmMod={currentThread?.creator.id === userId}
          userId={userId}
          currentCursor={cursor}
        />
      ))}
      {data.nextCursor && isLastPage ? (
        <div className="flex w-full justify-center">
          <button
            type="button"
            className="bg-alabaster-600 px-3 rounded-md"
            onClick={() => {
              onLoadMore(data.nextCursor!);
            }}
          >
            load more
          </button>
        </div>
      ) : null}
    </>
  );
};

Page.displayName = "Page";

export const MessagesList: React.FC<MessagesListProps> = ({ threadId }) => {
  const [cursors, setCursors] = useState<number[]>([0]);
  const { ref, inView } = useInView({ threshold: 0 });
  const { user } = useConn();

  useEffect(() => {
    if (!inView) {
      window.scroll({ behavior: "smooth", top: 0 });
    }
  }, []);

  return (
    <div className="flex flex-1 gap-4 w-full justify-end overflow-y-auto">
      <div className="flex flex-col-reverse gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700 w-full overflow-x-hidden">
        {cursors.map((c, i) => (
          <Page
            key={c}
            userId={user.id}
            cursor={c}
            threadId={threadId}
            onLoadMore={(nc) => setCursors([...cursors, nc])}
            isLastPage={i === cursors.length - 1}
            isOnlyPage={cursors.length === 1}
          />
        ))}
        <div ref={ref} />
      </div>
    </div>
  );
};

MessagesList.displayName = "MessagesList";
