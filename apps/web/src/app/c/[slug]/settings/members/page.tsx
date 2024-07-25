"use client";

import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";
import { CommunitySettingsLayout } from "@spek/ui";

interface PageProps {
  params: { slug: string };
}

export default function CommunityMembersPage({ params }: PageProps) {
  return (
    <WaitForWsAndAuth>
      <CommunitySettingsLayout communitySlug={params.slug}>
        <div>
          <p>Members</p>
        </div>
      </CommunitySettingsLayout>
    </WaitForWsAndAuth>
  );
}
