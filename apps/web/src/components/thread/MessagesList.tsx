import { User } from "@spek/client";
import React from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Avatar } from "@/ui/avatar";
import { format } from "date-fns";

interface MessagesListProps {
  threadId: string;
  currentUser: User;
}

export const MessagesList: React.FC<MessagesListProps> = ({ threadId }) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getThreadMessages", threadId],
    { staleTime: Infinity, refetchOnMount: "always" },
    [threadId]
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <>
      {data?.map((m) => (
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
    </>
  );
};
