"use client";

import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
// import { toast } from "@spek/ui";
// import { WEBAPP_URL } from "@spek/lib/constants";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { MessageInput } from "@/components/thread/MessageInput";
import { MessagesList } from "@/components/thread/MessagesList";
// import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { useConn } from "@/hooks/useConn";
// import { useTypeSafeUpdateQuery } from "@/hooks/useTypeSafeUpdateQuery";
// import { copyTextToClipboard } from "@/utils/copyToClipboard";
import { CenterLoader } from "@/components/CenterLoader";
import { Icon } from "@spek/ui";

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
  // const { mutateAsync: unsubscribe, isLoading: unsubscribeLoading } =
  //   useTypeSafeMutation("unsubscribeToThread");
  // const { mutateAsync: subscribe, isLoading: subscribeLoading } =
  //   useTypeSafeMutation("subscribeToThread");
  // const updateQuery = useTypeSafeUpdateQuery();

  if (isLoading) {
    return <CenterLoader />;
  }

  if (!data) {
    router.back();
  }

  const dt = new Date(data?.inserted_at!);

  return (
    <div className="flex flex-col gap-3 h-full">
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
        {/* <div className="flex gap-2 items-center">
          {user ? (
            <button
              disabled={subscribeLoading || unsubscribeLoading}
              type="button"
              className="flex gap-2 items-center bg-primary-900 text-primary-50 py-1 px-2 rounded-md"
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
              className="flex gap-2 items-center bg-primary-900 text-primary-50 py-1 px-2 rounded-md"
              onClick={() => {
                router.push(`/?next=/thread/${data?.id}`);
              }}
            >
              <NotificationIcon width={16} height={16} />
              <span>Subscribe</span>
            </button>
          )}
          <div className="cursor-pointer">
            <span
              onClick={() => {
                copyTextToClipboard(`${WEBAPP_URL}/thread/${data?.id}`);
                toast("Text copied successfully");
              }}
            >
              <LinkIcon />
            </span>
          </div>
        </div> */}
      </div>
      <div className="flex flex-1 flex-col-reverse gap-4">
        <MessagesList threadId={data?.id!} currentUser={user} />
      </div>
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
