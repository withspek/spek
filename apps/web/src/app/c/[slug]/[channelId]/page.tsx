import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { Metadata } from "next";
import { ChannelPageController } from "./controller";
import { MainLayout } from "@spek/ui";
import { LeftPanel } from "@/components/Panels";
import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";

interface Props {
  params: { channelId: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { channel } = await defaultQueryFn({
    queryKey: `api/v1/channels/${params.channelId}`,
  });

  return {
    title: channel.name,
    description: channel.description,
  };
}

export default function ChannelPage({ params }: Props) {
  return (
    <WaitForWsAndAuth>
      <MainLayout leftPanel={<LeftPanel />}>
        <ChannelPageController
          communitySlug={params.slug}
          channelId={params.channelId}
        />
        <div />
      </MainLayout>
    </WaitForWsAndAuth>
  );
}
