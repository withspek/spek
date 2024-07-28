"use client";

import React from "react";
import { format } from "date-fns";
import { Icon } from "@spek/ui";
import { useRouter } from "next/navigation";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { MessageInput } from "@/components/thread/MessageInput";
import { MessagesList } from "@/components/thread/MessagesList";
import { useConn } from "@/hooks/useConn";
import { CenterLoader } from "@/components/CenterLoader";

interface ThreadPageControllerProps {
  threadId: string;
}

export const ThreadPageController: React.FC<ThreadPageControllerProps> = ({
  threadId,
}) => {
  const { user } = useConn();
  const router = useRouter();
  const { data, isLoading } = useTypeSafeQuery(
    ["joinThreadAndGetInfo", threadId],
    { staleTime: Infinity, refetchOnMount: "always" },
    [threadId]
  );

  if (isLoading) {
    return <CenterLoader />;
  }

  if (!data) {
    router.back();
  }

  const dt = new Date(data?.inserted_at!);

  return (
    <div className="flex flex-col gap-3 h-screen">
      <div className={`z-20 sticky top-0 bg-primary-950`}>
        <div className="flex flex-col py-2  gap-2 rounded-b-md">
          <div className="inline-flex gap-4">
            <Icon
              name="arrow-left"
              className="cursor-pointer"
              onClick={() => router.back()}
            />
            <p className="text-xl capitalize">{data?.name}</p>
          </div>
          <p className="text-primary-300">
            {format(dt, "MMM dd, yyyy - hh:MM a")}
          </p>
        </div>
      </div>
      <MessagesList threadId={data?.id!} currentUser={user} />
      <div className="w-full py-3 sticky bottom-0 bg-primary-950">
        <MessageInput
          currentUser={user}
          threadId={data?.id!}
          communityId={data?.communityId!}
        />
      </div>
    </div>
  );
};
