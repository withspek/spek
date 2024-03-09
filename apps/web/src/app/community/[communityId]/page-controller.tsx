"use client";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

interface Props {
  id: string;
}

export const CommunityPageController: React.FC<Props> = ({ id }: Props) => {
  const { data, isLoading } = useTypeSafeQuery(["getCommunity", id], {}, [id]);

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h1 className="text-xl">{data?.name}</h1>
      <p>{data?.description}</p>
      <p>{data?.memberCount}</p>
    </div>
  );
};
