import React from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { useRouter } from "next/navigation";

interface MembersListProps {
  communityId: string;
}

export const MembersList: React.FC<MembersListProps> = ({ communityId }) => {
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
          className="cursor-pointer"
          key={m.id}
          onClick={() => {
            push(`/u/${m.id}`);
          }}
        >
          <img src={m.avatarUrl} alt={m.username} />
          <p>{m.displayName}</p>
        </div>
      ))}
    </div>
  );
};
