"use client";

import { CenterLoader } from "@/components/CenterLoader";
import { ConversationsList } from "@/components/direct/ConversationsList";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

export const DirectMessagePageController: React.FC = ({}) => {
  const { data, isLoading } = useTypeSafeQuery("getUserLodges");

  if (isLoading) {
    return <CenterLoader />;
  }

  return (
    <div>
      <h2>Directs</h2>
      <ConversationsList conversations={data!} />
    </div>
  );
};
