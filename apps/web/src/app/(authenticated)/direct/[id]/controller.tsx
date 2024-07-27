"use client";

import React from "react";

import { MessageInput } from "@/components/direct/MessageInput";
import { MessagesList } from "@/components/direct/MessagesList";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Header } from "@/components/direct/Header";

interface Props {
  lodgeId: string;
}

export const DmPageController: React.FC<Props> = ({ lodgeId }) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["joinLodgeAndGetInfo", lodgeId],
    {
      staleTime: Infinity,
      refetchOnMount: "always",
    },
    [lodgeId]
  );

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <Header recipients={data?.recipients} />
      <div className="flex flex-col flex-1 justify-end">
        <MessagesList lodgeId={lodgeId} />
      </div>
      <div className="py-3 bg-primary-950 sticky bottom-0">
        <MessageInput lodgeId={lodgeId} />
      </div>
    </div>
  );
};
