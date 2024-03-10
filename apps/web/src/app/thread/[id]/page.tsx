import { Metadata } from "next";
import { Thread } from "@spek/client";

import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { ThreadPageController } from "./page-controller";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  const thread: Thread = await defaultQueryFn({ queryKey: `/threads/${id}` });

  return {
    title: thread.name,
  };
}

export default function ThreadPage({ params }: Props) {
  return (
    <div className="w-md">
      <ThreadPageController threadId={params.id} />
    </div>
  );
}
