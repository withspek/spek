"use client";

import React from "react";
import { Thread } from "@spek/client";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Input } from "@/ui/input";
import { useConn } from "@/hooks/useConn";
import { format } from "date-fns";

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

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="bg-alabaster-600 px-4 py-2 rounded-b-md">
        <p>{thread.name}</p>
        <p>Started at {thread.inserted_at}</p>
      </div>
      <div className="flex flex-1 flex-col">
        {data?.map((m) => (
          <div key={m.id}>
            <p>{m.text}</p>
            <p>{format(new Date(m.inserted_at), "yyyy dd")}</p>
          </div>
        ))}
      </div>
      <div className="mb-3">
        <Input placeholder="Send a message" disabled={!user} />
      </div>
    </div>
  );
};
