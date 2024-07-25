import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { Metadata } from "next";
import { UserProfileController } from "./controller";
import { MainLayout } from "@spek/ui";
import { LeftPanel } from "@/components/Panels";
import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";

interface Props {
  params: { userId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { user } = await defaultQueryFn({
    queryKey: `api/v1/users/${params.userId}`,
  });

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
    <WaitForWsAndAuth>
      <MainLayout leftPanel={<LeftPanel />}>
        <UserProfileController userId={params.userId} />
      </MainLayout>
    </WaitForWsAndAuth>
  );
};

export default UserProfilePage;
