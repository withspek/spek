import { Metadata } from "next";
import { CommunitySettingsLayout } from "@spek/ui";

import { PageController } from "./controller";

interface PageProps {
  params: { slug: string };
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: "Settings",
    description: "Community settings",
  };
}

export default function CommunitySettingsPage({ params }: PageProps) {
  return (
    <CommunitySettingsLayout communitySlug={params.slug}>
      <PageController slug={params.slug} />
    </CommunitySettingsLayout>
  );
}
