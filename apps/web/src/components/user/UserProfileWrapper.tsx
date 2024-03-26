import { Button } from "@/ui/button";
import { User } from "@spek/client";

export type UserProfileWrapperProps = {
  isCurrentUser: boolean;
  user: User;
};

export const UserProfileWrapper: React.FC<UserProfileWrapperProps> = ({
  isCurrentUser,
  user,
}) => {
  return (
    <div>
      <p className="text-xl font-bold">{user.displayName}</p>
      <p>{user.bio}</p>
      {isCurrentUser ? (
        <div className="flex gap-4">
          <Button>Edit profile</Button>
          <Button>Logout</Button>
        </div>
      ) : null}
    </div>
  );
};
