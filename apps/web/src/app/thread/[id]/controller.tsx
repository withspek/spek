"use client";

import React from "react";
import { Thread } from "@spek/client";
import { format } from "date-fns";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { useConn } from "@/hooks/useConn";
import { MessageInput } from "@/components/thread/MessageInput";
import { Avatar } from "@/ui/avatar";
import { MessagesList } from "@/components/thread/MessagesList";

interface ThreadPageControllerProps {
  threadId: string;
}

export const ThreadPageController: React.FC<ThreadPageControllerProps> = ({
  threadId,
}) => {
  const { user } = useConn();
  const { data, isLoading } = useTypeSafeQuery(
    ["joinThreadAndGetInfo", threadId],
    {},
    [threadId]
  );

  if (isLoading) {
    // TODO: make this better
    return <div>loading...</div>;
  }
  const dt = new Date(data?.inserted_at!);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="bg-alabaster-600 px-4 py-2 rounded-b-md">
        <p>{data?.name}</p>
        <p>Started at {format(dt, "MMM dd hh:MM a")}</p>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <MessagesList threadId={data?.id!} currentUser={user} />
      </div>
      <div className="mb-3">
        <MessageInput
          currentUser={user}
          threadId={data?.id!}
          communityId={data?.communityId!}
        />
      </div>
    </div>
  );
};
