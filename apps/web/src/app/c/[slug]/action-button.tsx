import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { useTypeSafeUpdateQuery } from "@/hooks/useTypeSafeUpdateQuery";
import { Button } from "@/ui/button";
import { CommunityWithPermissions, User } from "@spek/client";
import { useRouter } from "next/navigation";

interface ActionButtonProps {
  currentUser: User;
  community: CommunityWithPermissions;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  community,
  currentUser,
}) => {
  const { push } = useRouter();
  const { mutateAsync, isLoading } = useTypeSafeMutation("joinCommunity");
  const { mutateAsync: leaveCommunity, isLoading: isLeaveLoading } =
    useTypeSafeMutation("leaveCommunity");
  const updateQuery = useTypeSafeUpdateQuery();

  const isTeamMember =
    community.isAdmin || community.isMember || community.isMod;

  return (
    <>
      {isTeamMember ? (
        <>
          <p>You are a member</p>
          {!community.isAdmin && (
            <Button
              loading={isLeaveLoading}
              onClick={async () => {
                if (currentUser) {
                  await leaveCommunity([
                    { communityId: community.id, userId: currentUser.id },
                  ]);
                  updateQuery(["getCommunity", community.slug], (data) => ({
                    ...data,
                    community: {
                      ...data.community,
                      memberCount: data.community.memberCount - 1,
                      isAdmin: false,
                      isMember: false,
                      isMod: false,
                    },
                  }));
                }
              }}
            >
              Leave
            </Button>
          )}
        </>
      ) : (
        <Button
          loading={isLoading}
          onClick={async () => {
            if (currentUser) {
              await mutateAsync([
                { communityId: community.id, userId: currentUser.id },
              ]);
              updateQuery(["getCommunity", community.slug], (data) => ({
                ...data,
                community: {
                  ...data.community,
                  memberCount: data.community.memberCount + 1,
                  isAdmin: false,
                  isMember: true,
                  isMod: false,
                },
              }));
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
