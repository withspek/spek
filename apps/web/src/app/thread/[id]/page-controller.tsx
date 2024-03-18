"use client";

import React from "react";
import { Thread } from "@spek/client";
import { format } from "date-fns";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { useConn } from "@/hooks/useConn";
import { MessageInput } from "@/components/thread/MessageInput";

interface ThreadPageControllerProps {
  thread: Thread;
}

export const ThreadPageController: React.FC<ThreadPageControllerProps> = ({
  thread,
}) => {
  const { user } = useConn();
  const { data, isLoading } = useTypeSafeQuery(
    ["getThreadMessages", thread.id],
    {},
    [thread.id]
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  const dt = new Date(thread.inserted_at);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="bg-alabaster-600 px-4 py-2 rounded-b-md">
        <p>{thread.name}</p>
        <p>Started at {format(dt, "MMM dd hh:MM a")}</p>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        {data?.map((m) => (
          <div key={m.id} className="bg-alabaster-800 px-3 py-4">
            <p>{m.text}</p>
          </div>
        ))}
      </div>
      <div className="mb-3">
        <MessageInput currentUser={user} thread={thread} />
      </div>
    </div>
  );
};
