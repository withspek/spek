import { useConn } from "@/hooks/useConn";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Button } from "@/ui/button";
import { useRouter } from "next/navigation";

interface JoinButtonProps {
  communityId: string;
}

export const JoinButton: React.FC<JoinButtonProps> = ({ communityId }) => {
  const { user } = useConn();
  const { push } = useRouter();
  const { mutateAsync } = useTypeSafeMutation("joinCommunity");
  const { data, isLoading } = useTypeSafeQuery(
    ["getCommunityPermissions", communityId],
    { refetchOnWindowFocus: false },
    [communityId]
  );

  if (isLoading) {
    return null;
  }

  const isTeamMember = data?.isAdmin || data?.isMember || data?.isMod;

  return (
    <>
      {isTeamMember ? (
        <p>You are a member</p>
      ) : (
        <Button
          onClick={async () => {
            if (user) {
              await mutateAsync([{ communityId, userId: user.id }]);
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
