"use client";

import { useRouter } from "next/navigation";

import { Overview } from "@/components/communitySettings/Overview";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Header } from "@/components/communitySettings/Header";
import { CenterLoader } from "@/components/CenterLoader";

interface PageControllerProps {
  slug: string;
}

export const PageController: React.FC<PageControllerProps> = ({ slug }) => {
  const router = useRouter();
  const { data, isLoading } = useTypeSafeQuery(["getCommunity", slug], {}, [
    slug,
  ]);

  if (isLoading || !data) {
    return <CenterLoader />;
  }

  if (!data.community.isAdmin) {
    router.replace("/home");
  }

  return (
    <div>
      <Header heading="Overview" communitySlug={data.community.slug} />
      <Overview
        channels={data.channels}
        community={data.community}
        communitySlug={slug}
      />
    </div>
  );
};
