import Link from "next/link";
import { format } from "date-fns";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { AvatarGroup } from "@/ui/avatar-group";
import { useTypeSafePrefetch } from "@/hooks/useTypeSafePrefetch";
import { CenterLoader } from "../CenterLoader";

interface ThreadsFeedProps {
  channelId: string;
}

export const ThreadsFeed: React.FC<ThreadsFeedProps> = ({ channelId }) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getChannelThreads", channelId],
    { refetchOnMount: false },
    [channelId]
  );
  const prefetch = useTypeSafePrefetch();

  if (isLoading) {
    return <CenterLoader />;
  }

  return (
    <>
      {data?.map((thread) => {
        const avatarSrc = thread.peoplePreviewList.map((p) => p.avatarUrl);
        return (
          <Link
            href={`/thread/${thread.id}`}
            key={thread.id}
            onClick={() => {
              prefetch(["joinThreadAndGetInfo", thread.id], [thread.id]);
            }}
          >
            <div className="px-3 py-5 rounded-lg">
              <div className="flex flex-1 justify-between mb-2">
                <p>{thread.name}</p>
                <AvatarGroup srcArray={avatarSrc} />
              </div>
              <p className="text-sm text-primary-400">
                {format(thread.inserted_at, "MMMM d, hh:mm a")}
              </p>
            </div>
          </Link>
        );
      })}
    </>
  );
};
