import React from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { CenterLoader } from "@/components/CenterLoader";
import { Button, ThreadCard } from "@spek/ui";
import Link from "next/link";

interface ThreadsListProps {
  cursor: number;
  onLoadMore: (cursor: number) => void;
  isLastPage: boolean;
  isOnlyPage: boolean;
}

export const ThreadsList: React.FC<ThreadsListProps> = ({
  cursor,
  isLastPage,
  isOnlyPage,
  onLoadMore,
}) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getTopActiveThreads", cursor],
    { staleTime: Infinity, refetchOnMount: "always" },
    [cursor]
  );

  if (isLoading) {
    return <CenterLoader />;
  }

  if (!data) {
    return null;
  }

  if (isOnlyPage && !isLoading && !data.threads.length) {
    return <div>No messages yet</div>;
  }

  return (
    <>
      {data?.threads.map((thread) => (
        <Link href={`/thread/${thread.id}`} key={thread.id}>
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
          />
        </Link>
      ))}
      {data.nextCursor && isLastPage ? (
        <div className="flex w-full justify-center">
          <Button
            type="button"
            onClick={() => {
              onLoadMore(data.nextCursor!);
            }}
          >
            Load more
          </Button>
        </div>
      ) : null}
    </>
  );
};
