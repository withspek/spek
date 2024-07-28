import { Avatar } from "@spek/ui";
import { format } from "date-fns";
import { useInView } from "react-intersection-observer";
import { Message as ThreadMessage, User } from "@spek/client";
import React, { useEffect, useMemo, useState } from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { ApiPreloadLink } from "../ApiPreloadLink";

interface MessagesListProps {
  threadId: string;
  currentUser: User;
}

interface PageProps {
  threadId: string;
  cursor: number;
  onLoadMore: (cursor: number) => void;
  isLastPage: boolean;
  isOnlyPage: boolean;
}

const Message: React.FC<{ message: ThreadMessage }> = ({ message }) => {
  const dt = useMemo(
    () => new Date(message.inserted_at),
    [message.inserted_at]
  );

  return (
    <div className={`flex flex-1 items-center px-3 rounded-md py-4 gap-3`}>
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
        <p>{message.text}</p>
      </div>
    </div>
  );
};

const Page = ({
  threadId,
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
        <Message key={m.id} message={m} />
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

  useEffect(() => {
    if (!inView) {
      window.scroll({ behavior: "smooth", top: 0 });
    }
  }, []);

  return (
    <div className="flex flex-1 gap-4 w-full overflow-y-auto">
      <div className="flex flex-col-reverse gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700 w-full overflow-x-hidden">
        {cursors.map((c, i) => (
          <Page
            key={c}
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
