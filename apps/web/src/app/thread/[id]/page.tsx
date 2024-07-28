import { Metadata } from "next";
import { Thread } from "@spek/client";

import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { ThreadPageController } from "./controller";
import { MainLayout } from "@spek/ui";
import { LeftPanel } from "@/components/Panels";
import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  const thread: Thread = await defaultQueryFn({
    queryKey: `/api/v1/threads/${id}`,
  });

  return {
    title: thread.name,
  };
}

export default async function ThreadPage({ params }: Props) {
  return (
    <WaitForWsAndAuth>
      <MainLayout leftPanel={<LeftPanel />}>
        <ThreadPageController threadId={params.id} />
      </MainLayout>
    </WaitForWsAndAuth>
  );
}
