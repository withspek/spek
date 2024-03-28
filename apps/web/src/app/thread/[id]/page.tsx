import { Metadata } from "next";
import { Thread } from "@spek/client";

import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { ThreadPageController } from "./controller";

type Props = {
  params: { id: string };
};

async function getThreadData(id: string) {
  return await defaultQueryFn({ queryKey: `/threads/${id}` });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  const thread: Thread = await getThreadData(id);

  return {
    title: thread.name,
  };
}

export default async function ThreadPage({ params }: Props) {
  const thread = await getThreadData(params.id);

  return (
    <>
      <ThreadPageController thread={thread} />
    </>
  );
}
