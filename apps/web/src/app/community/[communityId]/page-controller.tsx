"use client";

import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Button } from "@/ui/button";

interface Props {
  id: string;
}

export const CommunityPageController: React.FC<Props> = ({ id }: Props) => {
  const { user } = useConn();
  const { data, isLoading } = useTypeSafeQuery(["getCommunity", id], {}, [id]);

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="w-md">
      <h1 className="text-xl">{data?.name}</h1>
      <p>{data?.description}</p>
      <p>{data?.memberCount}</p>
      {user ? <Button>join</Button> : null}
    </div>
  );
};
