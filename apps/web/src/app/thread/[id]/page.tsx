import { Metadata } from "next";
import { Thread } from "@spek/client";
import { MainLayout } from "@spek/ui";
import { WEBAPP_URL } from "@spek/lib/constants";

import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { ThreadPageController } from "./controller";
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

  const ogImage = `${WEBAPP_URL}/thread/og?title=${thread.name}&creatorAvatar=${thread.creator.avatarUrl}`;

  return {
    title: thread.name,
    openGraph: {
      title: thread.name,
      type: "article",
      publishedTime: thread.inserted_at,
      url: `${WEBAPP_URL}/thread/${thread.id}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: thread.name,
      creator: thread.creator.displayName,
      images: [ogImage],
    },
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
