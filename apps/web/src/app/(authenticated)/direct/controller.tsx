"use client";

import { ConversationsList } from "@/components/direct/ConversationsList";

export const DirectMessagePageController: React.FC = ({}) => {
  return (
    <>
      <h2>Directs</h2>
      <ConversationsList />
    </>
  );
};
