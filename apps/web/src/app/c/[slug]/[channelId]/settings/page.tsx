import { Metadata } from "next";
import { SettingsPageController } from "./controller";

interface Props {
  params: { slug: string; channelId: string };
}

export const metadata: Metadata = {
  title: "Channel settings",
};

export default function ChannelSettingsPage({ params }: Props) {
  return (
    <>
      <SettingsPageController
        channelId={params.channelId}
        communitySlug={params.slug}
      />
    </>
  );
}
