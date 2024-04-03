import { User } from "@spek/client";
import React from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Avatar } from "@/ui/avatar";

interface MessagesListProps {
  threadId: string;
  currentUser: User;
}

export const MessagesList: React.FC<MessagesListProps> = ({
  threadId,
  currentUser,
}) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getThreadMessages", threadId],
    {},
    [threadId]
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <>
      {data?.map((m) => (
        <div
          key={m.id}
          className={`flex gap-4 bg-alabaster-800 px-3 py-4 ${
            currentUser && currentUser.id == m.user.id ? "bg-alabaster-500" : ""
          } `}
        >
          <Avatar src={m.user.avatarUrl} size="xs" isOnline={m.user.online} />
          <div>
            <p>{m.user.displayName}</p>
            <p>{m.text}</p>
          </div>
        </div>
      ))}
    </>
  );
};
