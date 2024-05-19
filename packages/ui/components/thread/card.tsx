"use client";
import { AvatarGroup } from "../avatar";
import { Badge } from "../badge";

export interface ThreadCardProps {
  conversation: {
    messageCount: number;
    channelName: string;
    communityName: string;
    name: string;
    description: string;
  };
  avatars: {
    image: string;
    title?: string;
    alt?: string;
    href?: string | null;
  }[];
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
  avatars,
  conversation,
}) => {
  const message =
    conversation.messageCount > 1
      ? `${conversation.messageCount} messages`
      : `${conversation.messageCount} message`;
  return (
    <div className="border-b border-primary-200">
      <div className="flex gap-2">
        <p className="uppercase">{conversation.communityName}</p>
        <Badge>{conversation.channelName}</Badge>
      </div>
      <div className="py-3">
        <p>{conversation.name}</p>
      </div>
      <div className="flex justify-between items-center py-3">
        <AvatarGroup items={avatars} size="sm" truncateAfter={3} />
        <p className="text-primary-700">{message}</p>
      </div>
    </div>
  );
};
