import { Header } from "@/components/Header";
import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { Metadata } from "next";
import { ChannelPageController } from "./controller";

interface Props {
  params: { channelId: string; communityId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const channel = await defaultQueryFn({
    queryKey: `/channels/${params.channelId}`,
  });

  return {
    title: channel[0].name,
    description: channel[0].description,
  };
}

export default function ChannelPage({ params }: Props) {
  return (
    <>
      <Header />
      <ChannelPageController
        communityId={params.communityId}
        channelId={params.channelId}
      />
    </>
  );
}
