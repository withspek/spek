import { useRouter } from "next/navigation";
import { useTokenStore } from "@/stores/useTokenStore";
import { Button } from "@spek/ui";
import { User } from "@spek/client";
import { useState } from "react";
import { EditProfileModal } from "./EditProfileModal";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { Avatar } from "@spek/ui";

export type UserProfileWrapperProps = {
  currentUser: User;
  user: User;
};

export const UserProfileWrapper: React.FC<UserProfileWrapperProps> = ({
  currentUser,
  user,
}) => {
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const { isLoading, mutateAsync } = useTypeSafeMutation("createDM");
  const { push } = useRouter();

  return (
    <div className="flex flex-col gap-4 mt-3">
      <Avatar
        imageSrc={user.avatarUrl}
        alt={user.username}
        accepted={true}
        size="xl"
      />
      <div>
        <p className="text-xl font-bold">{user.displayName}</p>
        <p>@{user.username}</p>
      </div>
      <p>{user.bio}</p>
      {currentUser && currentUser.id === user.id ? (
        <div className="flex gap-4">
          <Button onClick={() => setOpenEditModal(!openEditModal)}>
            Edit profile
          </Button>
          <Button
            onClick={() => {
              useTokenStore
                .getState()
                .setTokens({ accessToken: "", refreshToken: "" });
              push("/logout");
            }}
            color="destructive"
          >
            Logout
          </Button>
        </div>
      ) : (
        <div>
          <Button
            disabled={isLoading}
            onClick={async () => {
              if (currentUser) {
                const userIds = [user.id, currentUser.id];
                const dm = await mutateAsync([userIds]);

                if (dm) {
                  push(`/direct/${dm.id}`);
                }
              } else {
                push(`/?next=/u/${user.id}`);
              }
            }}
          >
            Message
          </Button>
        </div>
      )}
      {openEditModal ? (
        <EditProfileModal
          isOpen={openEditModal}
          onRequestClose={() => setOpenEditModal(false)}
        />
      ) : null}
    </div>
  );
};
