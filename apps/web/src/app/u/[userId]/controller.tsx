"use client";

import { UserProfileWrapper } from "@/components/user/UserProfileWrapper";
import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

export interface UserProfileControllerProps {
  userId: string;
}

export const UserProfileController: React.FC<UserProfileControllerProps> = ({
  userId,
}) => {
  const { user } = useConn();
  const { data, isLoading } = useTypeSafeQuery(["getUserProfile", userId], {}, [
    userId,
  ]);

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <UserProfileWrapper
        user={data?.user!}
        isCurrentUser={user.id === data?.user.id}
      />
    </div>
  );
};
