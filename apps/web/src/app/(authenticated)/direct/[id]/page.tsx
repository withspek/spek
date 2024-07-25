import { Metadata } from "next";
import { MainLayout } from "@spek/ui";

import { DmPageController } from "./controller";
import { LeftPanel } from "@/components/Panels";

type Props = {
  params: { id: string };
};

export const metadata: Metadata = {
  title: "Inbox",
};

export default function DmPage({ params }: Props) {
  return (
    <MainLayout leftPanel={<LeftPanel />}>
      <DmPageController lodgeId={params.id} />
    </MainLayout>
  );
}
