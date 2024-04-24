"use client";

import { Header } from "@/components/communitySettings/Header";
import { Overview } from "@/components/communitySettings/Overview";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { useRouter } from "next/navigation";

interface PageControllerProps {
  slug: string;
}

export const PageController: React.FC<PageControllerProps> = ({ slug }) => {
  const { data, isLoading } = useTypeSafeQuery(["getCommunity", slug], {}, [
    slug,
  ]);

  if (isLoading || !data) {
    return <div>loading...</div>;
  }

  const subheading = {
    label: `Return to ${data.community.name}`,
    description: `Manage your community settings by changing name or description.
    You can manage members and channels in the community here`,
    to: `/c/${data.community.slug}`,
  };

  return (
    <div>
      <Header heading="Settings" subheading={subheading} avatar="" />
      <Overview
        channels={data.channels}
        community={data.community}
        communitySlug={slug}
      />
    </div>
  );
};
