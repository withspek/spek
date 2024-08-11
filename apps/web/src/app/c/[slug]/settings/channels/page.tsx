import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";
import { CommunitySettingsLayout } from "@spek/ui";
import { Metadata } from "next";
import { ChannelsSettingsController } from "./controller";

interface PageProps {
  params: { slug: string };
}

export const metadata: Metadata = {
  title: "Channels",
};

export default function CommunityChannelsPage({ params }: PageProps) {
  return (
    <WaitForWsAndAuth>
      <CommunitySettingsLayout communitySlug={params.slug}>
        <ChannelsSettingsController slug={params.slug} />
      </CommunitySettingsLayout>
    </WaitForWsAndAuth>
  );
}
