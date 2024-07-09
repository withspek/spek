"use client";

import { CommunitySettingsLayout } from "@spek/ui";

interface PageProps {
  params: { slug: string };
}

export default function CommunityMembersPage({ params }: PageProps) {
  return (
    <CommunitySettingsLayout communitySlug={params.slug}>
      <div>
        <p>Members</p>
      </div>
    </CommunitySettingsLayout>
  );
}
