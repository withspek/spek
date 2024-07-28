"use client";

import React, { useContext } from "react";

import { MessageInput } from "@/components/direct/MessageInput";
import { MessagesList } from "@/components/direct/MessagesList";
import { Header } from "@/components/direct/Header";
import { ConversationContext } from "@/contexts/ConversationContext";

export const ConversationPageController: React.FC = () => {
  const { conversation } = useContext(ConversationContext);

  return (
    <div className="flex flex-col gap-3 h-screen">
      <Header
        recipients={conversation?.recipients}
        conversationId={conversation?.id}
      />
      <MessagesList lodgeId={conversation?.id!} />
      <MessageInput lodgeId={conversation?.id!} />
    </div>
  );
};
