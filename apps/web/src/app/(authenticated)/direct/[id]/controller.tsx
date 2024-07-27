"use client";

import React, { useContext } from "react";

import { MessageInput } from "@/components/direct/MessageInput";
import { MessagesList } from "@/components/direct/MessagesList";
import { Header } from "@/components/direct/Header";
import { ConversationContext } from "@/contexts/ConversationContext";

export const ConversationPageController: React.FC = () => {
  const { conversation } = useContext(ConversationContext);

  return (
    <div className="flex flex-col gap-3 h-full">
      <Header
        recipients={conversation?.recipients}
        conversationId={conversation?.id}
      />
      <div className="flex flex-col flex-1 justify-end">
        <MessagesList lodgeId={conversation?.id!} />
      </div>
      <div className="py-3 bg-primary-950 sticky bottom-0">
        <MessageInput lodgeId={conversation?.id!} />
      </div>
    </div>
  );
};
