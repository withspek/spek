import { Metadata } from "next";
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
    <>
      <PageController slug={params.slug} />
    </>
  );
}
