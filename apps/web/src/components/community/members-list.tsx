import React from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { useRouter } from "next/navigation";
import { Avatar } from "@/ui/avatar";
import { useConn } from "@/hooks/useConn";

interface MembersListProps {
  communityId: string;
}

export const MembersList: React.FC<MembersListProps> = ({ communityId }) => {
  const { user } = useConn();
  const { push } = useRouter();
  const { data, isLoading } = useTypeSafeQuery(
    ["getCommunityMembers", communityId],
    { refetchOnMount: false },
    [communityId]
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.map((m) => (
        <div
          className="flex gap-4 items-center cursor-pointer"
          key={m.id}
          onClick={() => {
            push(`/u/${m.id}`);
          }}
        >
          <Avatar src={m.avatarUrl} size="sm" username={m.username} />
          <div>
            <p>
              {m.displayName} {user && user.id === m.id && <span>(you)</span>}
            </p>
            <p className="text-alabaster-400 text-balance">{m.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
