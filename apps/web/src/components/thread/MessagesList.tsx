import { User } from "@spek/client";
import React, { useRef, useState } from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Avatar } from "@spek/ui";
import { format } from "date-fns";
import { useConn } from "@/hooks/useConn";

interface MessagesListProps {
  threadId: string;
  currentUser: User;
}

interface PageProps {
  threadId: string;
  cursor: number;
  user: User;
  onLoadMore: (cursor: number) => void;
  isLastPage: boolean;
  isOnlyPage: boolean;
}

const Page = React.forwardRef(
  (
    { threadId, cursor, isLastPage, isOnlyPage, user, onLoadMore }: PageProps,
    ref: any
  ) => {
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
          <div key={m.id} className={`flex gap-4 px-3 py-4`}>
            <Avatar
              imageSrc={m.user.avatarUrl}
              size="md"
              alt={m.user.username}
            />
            <div>
              <p className="text-sm">
                {m.user.displayName}{" "}
                <span className="text-primary-700">
                  {format(new Date(m.inserted_at), "dd/MM/yy H:mm a")}
                </span>
              </p>
              <p className="text-primary-800 text-sm">{m.text}</p>
            </div>
          </div>
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
  }
);

Page.displayName = "Page";

export const MessagesList: React.FC<MessagesListProps> = ({ threadId }) => {
  // The scrollable element for your list
  const parentRef = useRef<any>();
  const { user } = useConn();
  const [cursors, setCursors] = useState<number[]>([0]);

  return (
    <div className="flex flex-col-reverse gap-1" ref={parentRef}>
      {cursors.map((c, i) => (
        <Page
          key={c}
          cursor={c}
          user={user}
          ref={parentRef}
          threadId={threadId}
          onLoadMore={(nc) => setCursors([...cursors, nc])}
          isLastPage={i === cursors.length - 1}
          isOnlyPage={cursors.length === 1}
        />
      ))}
    </div>
  );
};

MessagesList.displayName = "MessagesList";
