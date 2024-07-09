import { Metadata } from "next";
import { MainLayout } from "@spek/ui";

import { SettingsPageController } from "./controller";

interface Props {
  params: { slug: string; channelId: string };
}

export const metadata: Metadata = {
  title: "Channel settings",
};

export default function ChannelSettingsPage({ params }: Props) {
  return (
    <MainLayout>
      <SettingsPageController
        channelId={params.channelId}
        communitySlug={params.slug}
      />
    </MainLayout>
  );
}
