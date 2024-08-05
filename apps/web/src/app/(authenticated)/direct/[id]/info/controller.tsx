"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import {
  Button,
  ConfirmationDialogContent,
  Dialog,
  Icon,
  showToast,
  UserAvatar,
} from "@spek/ui";

import { ConversationContext } from "@/contexts/ConversationContext";
import { useConn } from "@/hooks/useConn";
import { ApiPreloadLink } from "@/components/ApiPreloadLink";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";

export const ConversationInfoController: React.FC = () => {
  const router = useRouter();
  const { conversation } = useContext(ConversationContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useConn();
  const { mutateAsync: leaveLodge, isLoading: leaveLoading } =
    useTypeSafeMutation("leaveLodge");

  const handleShowConfirm = () => {
    setShowConfirm(!showConfirm);
  };

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
          onClick={handleShowConfirm}
        >
          Leave conversation
        </Button>
      </div>
      <Dialog open={showConfirm} onOpenChange={handleShowConfirm}>
        <ConfirmationDialogContent
          variety="danger"
          title="Delete conversation"
          isPending={leaveLoading}
          confirmBtnText="Delete conversation"
          onConfirm={async () => {
            await leaveLodge([conversation?.id!, user.id]);
            router.push("/direct");
            showToast("Conversation deleted successfully", "success");
          }}
        >
          Are you sure you want to delete this conversation
        </ConfirmationDialogContent>
      </Dialog>
    </div>
  );
};
