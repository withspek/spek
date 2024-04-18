import { baseUrl } from "@/utils/constants";
import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { Metadata, ResolvingMetadata } from "next";
import { CommunityPageController } from "./controller";
import { Header } from "@/components/Header";

type Props = {
  params: { communityId: string };
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.communityId;

  // fetch data

  const { community } = await defaultQueryFn({ queryKey: `community/${id}` });

  return {
    title: community.name,
    description: community.description,
    openGraph: {
      type: "website",
      description: community.description,
      siteName: "Spek",
      url: `${baseUrl}/c/${community.id}`,
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
    <>
      <Header />
      <CommunityPageController id={params.communityId} />
    </>
  );
}
