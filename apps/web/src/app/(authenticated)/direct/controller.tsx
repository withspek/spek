"use client";

import { CenterLoader } from "@/components/CenterLoader";
import { ConversationsList } from "@/components/direct/ConversationsList";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="mt-2">
      <div className="flex justify-between">
        <h2>Messages</h2>
      </div>
      {children}
    </div>
  );
};

export const DirectMessagePageController: React.FC = ({}) => {
  const { data, isLoading } = useTypeSafeQuery("getUserLodges");

  if (isLoading) {
    return (
      <Layout>
        <CenterLoader />
      </Layout>
    );
  }

  return (
    <Layout>
      <ConversationsList conversations={data!} />
    </Layout>
  );
};
