"use client";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import React from "react";

interface ThreadPageControllerProps {
  threadId: string;
}

export const ThreadPageController: React.FC<ThreadPageControllerProps> = ({
  threadId,
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
    <div>
      <p>Thread messages</p>
      {data?.map((m) => (
        <div key={m.id}>
          <p>{m.text}</p>
          <p>{m.inserted_at}</p>
        </div>
      ))}
    </div>
  );
};
