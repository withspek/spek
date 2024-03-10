import { Input } from "@/ui/input";
import { User } from "@spek/client";

interface ThreadsFeedProps {
  communityId: string;
  isMember: boolean;
  isAdmin: boolean;
  currentUser: User;
}

export const ThreadsFeed: React.FC<ThreadsFeedProps> = ({
  communityId,
  isAdmin,
  isMember,
}) => {
  return (
    <div>
      {isAdmin || isMember ? (
        <>
          <Input placeholder="Start a conversation" name="name" autoFocus />
        </>
      ) : null}
    </div>
  );
};
