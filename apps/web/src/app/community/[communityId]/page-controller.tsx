"use client";

import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Button } from "@/ui/button";

interface Props {
  id: string;
}

export const CommunityPageController: React.FC<Props> = ({ id }: Props) => {
  const { user } = useConn();
  const { data: community, isLoading } = useTypeSafeQuery(
    ["getCommunity", id],
    {},
    [id]
  );
  const { data: members, isLoading: loading } = useTypeSafeQuery(
    ["getCommunityMembers", id],
    {},
    [id]
  );

  if (isLoading || loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="w-md">
      <div className="bg-alabaster-500 mb-3 px-3">
        <h1 className="text-xl">{community?.name}</h1>
        <p>{community?.description}</p>
        <p>{community?.memberCount}</p>
      </div>
      {user ? <Button>join</Button> : null}
      <h3 className="text-alabaster-600">Members</h3>
      {members?.map((m) => (
        <div key={m.id}>
          <p>
            {m.displayName} <span>@{m.username}</span>
          </p>

          <p>{m.bio}</p>
        </div>
      ))}
    </div>
  );
};
