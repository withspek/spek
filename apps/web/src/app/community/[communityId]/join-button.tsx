import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Button } from "@/ui/button";
import { useRouter } from "next/navigation";

interface JoinButtonProps {
  communityId: string;
}

export const JoinButton: React.FC<JoinButtonProps> = ({ communityId }) => {
  const { user } = useConn();
  const { push } = useRouter();
  const { data, isLoading } = useTypeSafeQuery(
    ["getCommunityPermissions", communityId],
    {},
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
          onClick={() => {
            if (user) {
              push("/home");
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
