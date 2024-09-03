import { MainLayout } from "@spek/ui";
import { Metadata } from "next";

import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";
import { LeftPanel } from "@/components/Panels";
import { NotificationsController } from "./controller";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function NotificationsPage() {
  return (
    <WaitForWsAndAuth>
      <MainLayout leftPanel={<LeftPanel />}>
        <NotificationsController />
      </MainLayout>
    </WaitForWsAndAuth>
  );
}
