"use client";

import { ConversationsList } from "@/components/direct/ConversationsList";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

export const DirectMessagePageController: React.FC = ({}) => {
  const { data, isLoading } = useTypeSafeQuery("getUserDms");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2>Directs</h2>
      <ConversationsList conversations={data!} />
    </>
  );
};
