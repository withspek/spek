import React from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

interface MembersListProps {
  communityId: string;
}

export const MembersList: React.FC<MembersListProps> = ({ communityId }) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getCommunityMembers", communityId],
    {},
    [communityId]
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.map((m) => (
        <div key={m.id}>
          <img src={m.avatarUrl} alt={m.username} />
          <p>{m.displayName}</p>
        </div>
      ))}
    </div>
  );
};
