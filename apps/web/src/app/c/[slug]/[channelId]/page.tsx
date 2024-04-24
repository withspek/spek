import { Header } from "@/components/Header";
import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { Metadata } from "next";
import { ChannelPageController } from "./controller";

interface Props {
  params: { channelId: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { channel } = await defaultQueryFn({
    queryKey: `/channels/${params.channelId}`,
  });

  return {
    title: channel.name,
    description: channel.description,
  };
}

export default function ChannelPage({ params }: Props) {
  return (
    <>
      <Header />
      <ChannelPageController
        communitySlug={params.slug}
        channelId={params.channelId}
      />
    </>
  );
}
