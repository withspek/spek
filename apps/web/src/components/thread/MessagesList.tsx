import { useInView } from "react-intersection-observer";
import React, { useEffect, useState } from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { useConn } from "@/hooks/useConn";
import { Message } from "./Message";

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
          userId={userId}
          currentCursor={cursor}
          currentThread={currentThread!}
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
