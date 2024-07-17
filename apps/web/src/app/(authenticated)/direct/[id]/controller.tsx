"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { MessageInput } from "@/components/direct/MessageInput";
import { MessagesList } from "@/components/direct/MessagesList";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { PlusIcon } from "@/icons";
import { useConn } from "@/hooks/useConn";
import { Avatar } from "@spek/ui";

interface Props {
  dmId: string;
}
export const DmPageController: React.FC<Props> = ({ dmId }) => {
  const router = useRouter();
  const { user } = useConn();
  const { data, isLoading } = useTypeSafeQuery(
    ["joinDmAndGetInfo", dmId],
    {
      staleTime: Infinity,
      refetchOnMount: "always",
    },
    [dmId],
  );

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex justify-between items-center bg-primary-950 z-50 sticky top-0 py-3">
        <div className="flex gap-3 items-center">
          <div className="flex -space-x-4 rtl:space-x-reverse">
            {data?.peoplePreviewList
              .filter((p) => user.id !== p.id)
              .map((p) => (
                <Avatar key={p.id} alt={p.displayName} imageSrc={p.avatarUrl} />
              ))}
          </div>
          <p className="font-bold">
            {data?.peoplePreviewList
              .filter((p) => user.id !== p.id)
              .map((p) => p.displayName)
              .join(", ")}
          </p>
        </div>
        <button
          onClick={() => {
            router.back();
          }}
        >
          <PlusIcon className="rotate-45 transform" />
        </button>
      </div>
      <div className="flex flex-col flex-1 justify-end">
        <MessagesList dmId={dmId} />
      </div>
      <div className="py-3 bg-primary-950 sticky bottom-0">
        <MessageInput dmId={dmId} />
      </div>
    </div>
  );
};
