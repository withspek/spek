"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { MessageInput } from "@/components/thread/MessageInput";
import { MessagesList } from "@/components/thread/MessagesList";
import { LinkIcon, NotificationIcon, PlusIcon } from "@/icons";
import { Avatar } from "@/ui/avatar";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { useConn } from "@/hooks/useConn";
import { useTypeSafeUpdateQuery } from "@/hooks/useTypeSafeUpdateQuery";

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
  const { mutateAsync: unsubscribe, isLoading: unsubscribeLoading } =
    useTypeSafeMutation("unsubscribeToThread");
  const { mutateAsync: subscribe, isLoading: subscribeLoading } =
    useTypeSafeMutation("subscribeToThread");
  const updateQuery = useTypeSafeUpdateQuery();

  if (isLoading) {
    // TODO: make this better
    return <div>loading...</div>;
  }

  if (!data) {
    router.back();
  }

  const dt = new Date(data?.inserted_at!);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 mt-4">
          <Link href={`/u/${data?.creator.id}`}>
            <Avatar
              src={data?.creator.avatarUrl!}
              size="md"
              isOnline={data?.creator.online}
            />
          </Link>
          <div>
            <p>{data?.creator.displayName}</p>
            <p className="text-alabaster-400">@{data?.creator.username}</p>
          </div>
        </div>
        <div className="cursor-pointer" onClick={() => router.back()}>
          <PlusIcon className="rotate-45" width={28} height={28} />
        </div>
      </div>
      <div className="flex flex-col py-2 rounded-b-md">
        <p className="text-2xl capitalize">{data?.name}</p>
        <p className="text-alabaster-200">
          {format(dt, "MMM dd, yyyy - hh:MM a")}
        </p>
      </div>
      <div className="flex gap-2 items-center">
        {user ? (
          <button
            disabled={subscribeLoading || unsubscribeLoading}
            type="button"
            className="flex gap-2 items-center bg-alabaster-900 py-1 px-2 rounded-md"
            onClick={async () => {
              if (data?.youSubscribed) {
                const resp = await unsubscribe([threadId]);

                if (resp.success) {
                  updateQuery(
                    ["joinThreadAndGetInfo", threadId],
                    (oldData) => ({
                      ...oldData,
                      youSubscribed: false,
                    })
                  );
                }
              } else {
                const resp = await subscribe([threadId]);

                if (resp.success) {
                  updateQuery(
                    ["joinThreadAndGetInfo", threadId],
                    (oldData) => ({
                      ...oldData,
                      youSubscribed: true,
                    })
                  );
                }
              }
            }}
          >
            <NotificationIcon width={16} height={16} />
            <span>{data?.youSubscribed ? "Subscribed" : "Subcribe"}</span>
          </button>
        ) : (
          <button
            type="button"
            className="flex gap-2 items-center bg-alabaster-900 py-1 px-2 rounded-md"
            onClick={() => {
              router.push(`/?next=/thread/${data?.id}`);
            }}
          >
            <NotificationIcon width={16} height={16} />
            <span>Subscribe</span>
          </button>
        )}
        <div className="cursor-pointer">
          <LinkIcon />
        </div>
      </div>
      <div className="flex flex-1 flex-col-reverse gap-4">
        <MessagesList threadId={data?.id!} currentUser={user} />
      </div>
      <div className="mb-3">
        <MessageInput
          currentUser={user}
          threadId={data?.id!}
          communityId={data?.communityId!}
        />
      </div>
    </div>
  );
};
