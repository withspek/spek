import { MainLayout } from "@spek/ui";
import { Metadata } from "next";

import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";
import { LeftPanel } from "@/components/Panels";
import { DiscoverSearchController } from "@/components/search/DiscoverSearchController";

export const metadata: Metadata = {
  title: "Community Discovery",
  description:
    "Find out what communities are making people gain new connections and knowledge",
};

export default function DiscoverPage() {
  return (
    <WaitForWsAndAuth>
      <MainLayout leftPanel={<LeftPanel />}>
        <div className="mt-3">
          <DiscoverSearchController />
        </div>
      </MainLayout>
    </WaitForWsAndAuth>
  );
}
