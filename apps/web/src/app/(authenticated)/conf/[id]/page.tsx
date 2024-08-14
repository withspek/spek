import React from "react";
import { MainLayout } from "@spek/ui";
import { Metadata } from "next";

import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";
import { LeftPanel } from "@/components/Panels";
import { ConfController } from "./controller";

interface Props {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: "Room",
};

export default function ConfPage({ params }: Props) {
  return (
    <WaitForWsAndAuth>
      <MainLayout leftPanel={<LeftPanel />}>
        <div className="flex flex-col gap-2 px-3 pt-4 w-full">
          <ConfController id={params.id} />
        </div>
      </MainLayout>
    </WaitForWsAndAuth>
  );
}
