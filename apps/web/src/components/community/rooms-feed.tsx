import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import React from "react";
import { CenterLoader } from "../CenterLoader";
import Link from "next/link";
import { UserAvatarGroup } from "@spek/ui";

interface Props {
  communityId: string;
}

export const RoomsFeed: React.FC<Props> = ({ communityId }) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getTopPublicConfs", communityId],
    {},
    [communityId, 0]
  );

  if (isLoading) {
    return <CenterLoader />;
  }

  return (
    <>
      {data?.confs && data.confs.length ? (
        <div className="flex flex-col gap-4 py-6">
          {data?.confs.map((room) => (
            <Link
              key={room.id}
              href={`/conf/${room.id}`}
              className="space-y-2 bg-primary-900 px-4 py-2 rounded-md"
            >
              <div className="flex justify-between items-center">
                <p>{room.name}</p>
                <p className="text-sm">
                  <span className="inline-block mr-2 w-2 h-2 rounded-full bg-accent"></span>
                  {room.num_people_inside}
                </p>
              </div>
              <p className="text-primary-400">{room.description}</p>
              <UserAvatarGroup
                size="sm"
                users={room.people_preview_list}
                truncateAfter={5}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-6 mx-auto w-full text-center">
          <p>There are no live rooms yet. But you can start one</p>
        </div>
      )}
    </>
  );
};
