import { User } from "@spek/client";
import React, { useState } from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Avatar } from "@/ui/avatar";
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

const Page: React.FC<PageProps> = ({
  threadId,
  cursor,
  isLastPage,
  isOnlyPage,
  user,
  onLoadMore,
}) => {
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
          <Avatar src={m.user.avatarUrl} size="sm" isOnline={m.user.online} />
          <div>
            <p>
              {m.user.displayName}{" "}
              <span className="text-alabaster-500">
                {format(new Date(m.inserted_at), "dd/MM/yy h:mm a")}
              </span>
            </p>
            <p className="text-alabaster-300">{m.text}</p>
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
};

export const MessagesList: React.FC<MessagesListProps> = ({ threadId }) => {
  const { user } = useConn();
  const [cursors, setCursors] = useState<number[]>([0]);

  return (
    <div className="flex flex-col-reverse gap-1">
      {cursors.map((c, i) => (
        <Page
          key={c}
          cursor={c}
          user={user}
          threadId={threadId}
          onLoadMore={(nc) => setCursors([...cursors, nc])}
          isLastPage={i === cursors.length - 1}
          isOnlyPage={cursors.length === 1}
        />
      ))}
    </div>
  );
};
