"use client";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { Button, Icon, toast, UserAvatar } from "@spek/ui";

import { ConversationContext } from "@/contexts/ConversationContext";
import { useConn } from "@/hooks/useConn";
import { ApiPreloadLink } from "@/components/ApiPreloadLink";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { confirmModal } from "@/components/ConfirmModal";

export const ConversationInfoController: React.FC = () => {
  const router = useRouter();
  const { conversation } = useContext(ConversationContext);
  const { user } = useConn();
  const { mutateAsync: leaveLodge, isLoading: leaveLoading } =
    useTypeSafeMutation("leaveLodge");

  return (
    <div className="flex flex-col mt-3 gap-4">
      <div className="flex gap-8 items-center">
        <Icon
          name="arrow-left"
          className="cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <p className="font-bold">Conversation info</p>
      </div>
      <p className="font-bold">People</p>
      {conversation?.recipients
        .filter((r) => r.id !== user.id)
        .map((r) => (
          <ApiPreloadLink
            route="profile"
            data={{ id: r.id }}
            className="flex items-center gap-4"
            key={r.id}
          >
            <UserAvatar user={r} size="mdLg" />
            <div>
              <p className="font-bold">{r.displayName}</p>
              <p className="text-sm">{r.bio}</p>
            </div>
          </ApiPreloadLink>
        ))}
      <div className="flex flex-col items-center justify-center">
        {/* <Button color="minimal">Add people</Button> */}
        <Button
          color="destructive"
          disabled={leaveLoading}
          onClick={() => {
            confirmModal(
              "This conversation will be deleted from your inbox. Other people in the conversation will still be able to see it.",
              async () => {
                const resp = await leaveLodge([conversation?.id!, user.id]);

                if (resp.success) {
                  router.push("/direct");
                } else {
                  toast("Something went wrong");
                }
              }
            );
          }}
        >
          Leave conversation
        </Button>
      </div>
    </div>
  );
};
