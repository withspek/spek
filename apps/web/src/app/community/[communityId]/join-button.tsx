import { useConn } from "@/hooks/useConn";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { Button } from "@/ui/button";
import { CommunityWithPermissions } from "@spek/client";
import { useRouter } from "next/navigation";

interface JoinButtonProps {
  community: CommunityWithPermissions;
}

export const JoinButton: React.FC<JoinButtonProps> = ({ community }) => {
  const { user } = useConn();
  const { push } = useRouter();
  const { mutateAsync, isLoading } = useTypeSafeMutation("joinCommunity");

  const isTeamMember =
    community.isAdmin || community.isMember || community.isMod;

  return (
    <>
      {isTeamMember ? (
        <p>You are a member</p>
      ) : (
        <Button
          loading={isLoading}
          onClick={async () => {
            if (user) {
              await mutateAsync([
                { communityId: community.id, userId: user.id },
              ]);
            } else {
              push("/login");
            }
          }}
        >
          Join community
        </Button>
      )}
    </>
  );
};
