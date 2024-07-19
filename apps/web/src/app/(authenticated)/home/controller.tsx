"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ThreadCard } from "@spek/ui";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { CenterLoader } from "@/components/CenterLoader";

interface ControllerProps {}

export const HomeController: React.FC<ControllerProps> = () => {
  const { data, isLoading } = useTypeSafeQuery("getTopActiveThreads");
  const { push } = useRouter();

  if (isLoading) {
    return <CenterLoader />;
  }

  return (
    <div className="flex flex-col flex-1">
      <h2>Feed</h2>
      <div className="flex flex-col gap-4 mt-3">
        {data?.map((thread) => (
          <ThreadCard
            avatars={thread.peoplePreviewList.map((user) => ({
              image: user.avatarUrl,
              alt: user.displayName,
              title: user.displayName,
            }))}
            conversation={{
              name: thread.name,
              communityName: thread.community.name,
              messageCount: thread.message_count,
            }}
            onClick={() => push(`/thread/${thread.id}`)}
          />
        ))}
      </div>
    </div>
  );
};
