"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { MessageInput } from "@/components/direct/MessageInput";
import { MessagesList } from "@/components/direct/MessagesList";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { PlusIcon } from "@/icons";

interface Props {
  dmId: string;
}
export const DmPageController: React.FC<Props> = ({ dmId }) => {
  const router = useRouter();
  const { data, isLoading } = useTypeSafeQuery(["joinDmAndGetInfo", dmId], {}, [
    dmId,
  ]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 mt-3 h-full">
      <div className="flex justify-between items-center sticky top-0 py-3 bg-alabaster-900">
        <div className="flex gap-3 items-center">
          <div className="flex -space-x-4 rtl:space-x-reverse">
            {data?.peoplePreviewList.map((p) => (
              <div className="relative" key={p.id}>
                <img
                  className="w-10 h-10 border-2 border-alabaster-300 rounded-full"
                  src={p.avatarUrl}
                  alt={p.displayName}
                />
                {/* {p.online ? (
                <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
              ) : null} */}
              </div>
            ))}
          </div>
          <p className="font-bold">
            {data?.peoplePreviewList.map((p) => p.displayName).join(", ")}
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
      <div className="mb-3 sticky bottom-0">
        <MessageInput dmId={dmId} />
      </div>
    </div>
  );
};
