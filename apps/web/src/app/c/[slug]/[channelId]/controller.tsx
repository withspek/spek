"use client";

import { CenterLoader } from "@/components/CenterLoader";
import { ThreadsFeed } from "@/components/community/threads-feed";
import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

interface ChannelPageControllerProps {
  channelId: string;
  communitySlug: string;
}

export const ChannelPageController: React.FC<ChannelPageControllerProps> = ({
  channelId,
}) => {
  const { user } = useConn();
  const { data, isLoading } = useTypeSafeQuery(
    ["getChannel", channelId],
    {
      staleTime: Infinity,
      refetchOnMount: "always",
    },
    [channelId]
  );

  if (isLoading || !data) {
    return <CenterLoader />;
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="bg-alabaster-700 px-3 py-4 rounded-md">
        <h3 className="text-xl">{data?.channel.name}</h3>
        <p>{data?.channel.description}</p>
        <p className="text-alabaster-400">
          {data?.channel.memberCount} members
        </p>
      </div>
      <div>
        <ThreadsFeed
          channel={data.channel}
          communityId={data.channel.community.id}
          currentUser={user}
          isAdmin={data.channel.isAdmin}
          isMember={data.channel.isMember}
        />
      </div>
    </div>
  );
};
