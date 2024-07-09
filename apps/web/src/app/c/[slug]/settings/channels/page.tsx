"use client";

import { CommunitySettingsLayout } from "@spek/ui";

interface PageProps {
  params: { slug: string };
}

export default function CommunityChannelsPage({ params }: PageProps) {
  return (
    <CommunitySettingsLayout communitySlug={params.slug}>
      <div>
        <p>Channels</p>
      </div>
    </CommunitySettingsLayout>
  );
}
