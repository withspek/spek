import Link from "next/link";
import { format } from "date-fns";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Input } from "@/ui/input";
import { Channel, User } from "@spek/client";

interface ThreadsFeedProps {
  communityId: string;
  isMember: boolean;
  isAdmin: boolean;
  currentUser: User;
  channel: Channel | undefined;
}

export const ThreadsFeed: React.FC<ThreadsFeedProps> = ({
  communityId,
  isAdmin,
  isMember,
  channel,
  currentUser,
}) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getChannelThreads", channel?.id!],
    { refetchOnMount: false },
    [channel?.id!]
  );

  if (isLoading) {
    return <div>loading..</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {isAdmin || isMember ? (
        <>
          <Input placeholder="Start a conversation" name="name" autoFocus />
        </>
      ) : null}
      {data?.map((thread) => (
        <Link href={`/thread/${thread.id}`}>
          <div
            key={thread.id}
            className="bg-alabaster-950 border-alabaster-500 border px-3 py-5"
          >
            <p>{thread.name}</p>
            <p>{format(thread.inserted_at, "MMMM d, hh:mm a")}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
