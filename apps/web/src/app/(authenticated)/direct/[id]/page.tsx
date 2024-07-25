import { Metadata } from "next";
import { MainLayout } from "@spek/ui";

import { DmPageController } from "./controller";
import { LeftPanel } from "@/components/Panels";
import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";

type Props = {
  params: { id: string };
};

export const metadata: Metadata = {
  title: "Inbox",
};

export default function DmPage({ params }: Props) {
  return (
    <WaitForWsAndAuth>
      <MainLayout leftPanel={<LeftPanel />}>
        <DmPageController lodgeId={params.id} />
      </MainLayout>
    </WaitForWsAndAuth>
  );
}
