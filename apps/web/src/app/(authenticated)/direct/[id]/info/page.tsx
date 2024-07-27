import { MainLayout } from "@spek/ui";
import { Metadata } from "next";
import { ConversationInfoController } from "./controller";
import { LeftPanel } from "@/components/Panels";

export const metadata: Metadata = {
  title: "Conversation info",
};

export default function ConversationsInfo() {
  return (
    <MainLayout leftPanel={<LeftPanel />}>
      <ConversationInfoController />
    </MainLayout>
  );
}
