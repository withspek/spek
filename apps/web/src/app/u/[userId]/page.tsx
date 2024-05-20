import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { Metadata } from "next";
import { UserProfileController } from "./controller";
import { MainLayout } from "@spek/ui";
import { LeftPanel } from "@/components/Panels";

interface Props {
  params: { userId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { user } = await defaultQueryFn({ queryKey: `/user/${params.userId}` });

  return {
    title: user.username,
    description: user.bio,
    openGraph: {
      description: user.bio,
      title: user.username,
    },
    twitter: {
      description: user.bio,
      images: [user.avatarUrl],
    },
  };
}

const UserProfilePage = ({ params }: Props) => {
  return (
    <MainLayout leftPanel={<LeftPanel />}>
      <UserProfileController userId={params.userId} />
      <div />
    </MainLayout>
  );
};

export default UserProfilePage;
