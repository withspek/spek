import { Metadata } from "next";
import { DirectMessagePageController } from "./controller";
import { MainLayout } from "@spek/ui";
import { LeftPanel } from "@/components/Panels";

export const metadata: Metadata = {
  title: "Direct",
};

export default function DirectMessagesPage() {
  return (
    <MainLayout leftPanel={<LeftPanel />}>
      <DirectMessagePageController />
    </MainLayout>
  );
}
