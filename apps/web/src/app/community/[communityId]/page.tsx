import { baseUrl } from "@/utils/constants";
import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: { communityId: string };
};

async function getCommunity(id: string) {
  return await defaultQueryFn({ queryKey: `community/${id}` });
}

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.communityId;

  // fetch data
  const community = await getCommunity(id);

  return {
    title: community.name,
    description: community.description,
    openGraph: {
      type: "website",
      description: community.description,
      siteName: "Spek",
      url: `${baseUrl}/community/${community.id}`,
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
  const data = await getCommunity(params.communityId);
  return (
    <div>
      <p>Hello</p>
    </div>
  );
}
