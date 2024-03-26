import { defaultQueryFn } from "@/utils/defaultQueryFn";
import { Metadata } from "next";
import { UserProfileController } from "./controller";

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
    <div>
      <UserProfileController userId={params.userId} />
    </div>
  );
};

export default UserProfilePage;
