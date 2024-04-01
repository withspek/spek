"use client";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import React from "react";

interface Props {
  dmId: string;
}
export const DmPageController: React.FC<Props> = ({ dmId }) => {
  const { data, isLoading } = useTypeSafeQuery(["joinDmAndGetInfo", dmId], {}, [
    dmId,
  ]);

  if (isLoading) {
    return null;
  }

  console.log(data);

  return (
    <div>
      {data?.peoplePreviewList.map((p) => (
        <p key={p.id}>{p.displayName}</p>
      ))}
    </div>
  );
};
