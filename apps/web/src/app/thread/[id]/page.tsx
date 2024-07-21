import { Metadata } from "next";
import { Thread } from "@spek/client";

import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { ThreadPageController } from "./controller";
import { MainLayout } from "@spek/ui";
import { LeftPanel } from "@/components/Panels";
import { FloatingThreadInfo } from "./FloatingThreadInfo";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  const thread: Thread = await await defaultQueryFn({
    queryKey: `/api/v1/threads/${id}`,
  });

  return {
    title: thread.name,
  };
}

export default async function ThreadPage({ params }: Props) {
  return (
    <MainLayout leftPanel={<LeftPanel />} rightPanel={<FloatingThreadInfo />}>
      <ThreadPageController threadId={params.id} />
    </MainLayout>
  );
}
