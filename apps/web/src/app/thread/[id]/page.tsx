import { Metadata } from "next";
import { Thread } from "@spek/client";

import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { ThreadPageController } from "./controller";
import { MainLayout } from "@spek/ui";
import { LeftPanel } from "@/components/Panels";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  const thread: Thread = await await defaultQueryFn({
    queryKey: `/threads/${id}`,
  });

  return {
    title: thread.name,
  };
}

export default async function ThreadPage({ params }: Props) {
  return (
    <MainLayout leftPanel={<LeftPanel />}>
      <ThreadPageController threadId={params.id} />
      <div />
    </MainLayout>
  );
}
