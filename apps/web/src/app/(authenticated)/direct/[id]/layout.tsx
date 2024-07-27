"use client";

import { ConversationContext } from "@/contexts/ConversationContext";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

export default function ConversationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  const { data, isLoading } = useTypeSafeQuery(
    ["joinLodgeAndGetInfo", params.id],
    {
      staleTime: Infinity,
      refetchOnMount: "always",
    },
    [params.id]
  );

  if (isLoading) {
    return null;
  }

  return (
    <ConversationContext.Provider value={{ conversation: data }}>
      {children}
    </ConversationContext.Provider>
  );
}
