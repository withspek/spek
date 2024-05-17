"use client";
import { Avatar, AvatarGroup } from "../avatar";
import { Badge } from "../badge";

export const ThreadCard: React.FC = () => {
  return (
    <div className="border-b border-primary-200">
      <div className="flex gap-2">
        {/* <Avatar alt="" shape="square" size="sm" /> */}
        <p className="uppercase">Spek support</p>
        <Badge>General</Badge>
      </div>
      <div className="py-3">
        <p>Talk about bugs and feature requests about spek in general</p>
      </div>
      <div className="flex justify-between items-center py-3">
        <AvatarGroup
          items={[
            { image: "/avatar.jpg" },
            { image: "/avatar.jpg" },
            { image: "/avatar.jpg" },
            { image: "/avatar.jpg" },
          ]}
          size="sm"
          truncateAfter={3}
        />
        <p className="text-primary-700">12 messages</p>
      </div>
    </div>
  );
};
