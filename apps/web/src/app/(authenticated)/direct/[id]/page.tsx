import { Metadata } from "next";
import { MainLayout } from "@spek/ui";

import { ConversationPageController } from "./controller";
import { LeftPanel } from "@/components/Panels";
import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";

export const metadata: Metadata = {
  title: "Inbox",
};

export default function ConversationPage() {
  return (
    <WaitForWsAndAuth>
      <MainLayout leftPanel={<LeftPanel />}>
        <ConversationPageController />
      </MainLayout>
    </WaitForWsAndAuth>
  );
}
