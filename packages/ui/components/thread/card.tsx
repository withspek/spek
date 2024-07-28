"use client";
import { AvatarGroup } from "../avatar";

export interface ThreadCardProps {
  conversation: {
    messageCount: number;
    communityName: string;
    name: string;
  };
  avatars: {
    image: string;
    title?: string;
    alt?: string;
    href?: string | null;
  }[];
  onClick?: () => void;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
  avatars,
  conversation,
  onClick,
}) => {
  const message =
    conversation.messageCount > 1
      ? `${conversation.messageCount} messages`
      : `${conversation.messageCount} message`;
  return (
    <div
      className="bg-primary-900 rounded-md px-4 py-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-2">
        <p className="uppercase text-sm">{conversation.communityName}</p>
      </div>
      <p className="text-primary-400">{conversation.name}</p>
      <div className="flex justify-between items-center py-3">
        <AvatarGroup items={avatars} size="sm" truncateAfter={3} />
        <p className="text-primary-200">{message}</p>
      </div>
    </div>
  );
};
