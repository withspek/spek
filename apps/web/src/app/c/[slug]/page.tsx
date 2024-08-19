import { MainLayout } from "@spek/ui";
import { Metadata, ResolvingMetadata } from "next";

import { baseUrl } from "@/utils/constants";
import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { CommunityPageController } from "./controller";
import { LeftPanel } from "@/components/Panels";
import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";
import { RightBlock } from "@/components/RightBlock";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data

  const { community } = await defaultQueryFn({
    queryKey: `api/v1/communities/${slug}`,
  });

  return {
    title: community.name,
    description: community.description,
    openGraph: {
      type: "website",
      description: community.description,
      siteName: "Spek",
      url: `${baseUrl}/c/${community.slug}`,
      images: [
        {
          url: community.coverPhoto
            ? `${community.coverPhoto}`
            : `${baseUrl}/og-image.png`, // Must be an absolute URL
          width: 800,
          height: 600,
        },
      ],
    },
  };
}

export default async function CommunityPage({ params }: Props) {
  return (
    <WaitForWsAndAuth>
      <MainLayout leftPanel={<LeftPanel />} rightPanel={<RightBlock />}>
        <CommunityPageController slug={params.slug} />
      </MainLayout>
    </WaitForWsAndAuth>
  );
}
