"use client";

import { CreateInput } from "@/components/community/create-input";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

interface ChannelPageControllerProps {
  channelId: string;
  communitySlug: string;
}

export const ChannelPageController: React.FC<ChannelPageControllerProps> = ({
  channelId,
}) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getChannel", channelId],
    {
      staleTime: Infinity,
      refetchOnMount: "always",
    },
    [channelId]
  );

  if (isLoading || !data) {
    return null;
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
        <CreateInput
          channelId={channelId}
          communityId={data.channel.community.id}
        />
      </div>
      <div></div>
    </div>
  );
};
