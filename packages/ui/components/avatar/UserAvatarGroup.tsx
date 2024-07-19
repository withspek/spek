import { User } from "@spek/client";
import { AvatarGroup } from "./AvatarGroup";

type UserAvatarProps = Omit<
  React.ComponentProps<typeof AvatarGroup>,
  "items"
> & {
  users: Pick<User, "displayName" | "username" | "avatarUrl">[];
};

export function UserAvatarGroup(props: UserAvatarProps) {
  const { users, ...rest } = props;

  return (
    <AvatarGroup
      {...rest}
      items={users.map((user) => ({
        image: user.avatarUrl,
        alt: user.username,
        title: user.displayName,
      }))}
    />
  );
}
