import { Metadata } from "next";
import { DirectMessagePageController } from "./controller";
import { MainLayout } from "@spek/ui";
import { LeftPanel } from "@/components/Panels";
import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";

export const metadata: Metadata = {
  title: "Direct",
};

export default function DirectMessagesPage() {
  return (
    <WaitForWsAndAuth>
      <MainLayout leftPanel={<LeftPanel />}>
        <DirectMessagePageController />
      </MainLayout>
    </WaitForWsAndAuth>
  );
}
