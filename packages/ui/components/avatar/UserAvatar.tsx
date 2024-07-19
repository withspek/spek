import { classNames } from "@spek/lib";
import { Avatar } from "./Avatar";
import { User } from "@spek/client";

type UserAvatarProps = Omit<
  React.ComponentProps<typeof Avatar>,
  "alt" | "imageSrc"
> & {
  user: Pick<User, "avatarUrl" | "username" | "displayName">;
  online?: boolean;
  /**
   * Useful when allowing the user to upload their own avatar and showing the avatar before it's uploaded
   */
  previewSrc?: string | null;
  alt?: string | null;
};

const indicatorBySize = {
  xxs: "hidden",
  xs: "hidden",
  xsm: "hidden",
  sm: "h-2 w-2 border border-primary-950 rounded-full",
  md: "h-3 w-3 border-2 border-primary-950 rounded-full",
  mdLg: "h-3 w-3 border-2 border-primary-950 rounded-full",
  lg: "h-5 w-5 border-2 border-primary-950 rounded-full",
  xl: "h-7 w-7 border-2 border-primary-950 rounded-full",
} as const;

function OnlineIndicator({
  size = "md",
}: Pick<UserAvatarProps, "size" | "user">) {
  const indicatorSize = size && indicatorBySize[size];

  return (
    <div
      className={classNames("absolute bottom-0 right-0 z-10", indicatorSize)}
    >
      <span className="flex h-full items-center justify-center rounded-full bg-green-400" />
    </div>
  );
}

export function UserAvatar(props: UserAvatarProps) {
  const { user, ...rest } = props;
  const indicator = props.online ? (
    <OnlineIndicator size={props.size} user={props.user} />
  ) : (
    props.indicator
  );

  return (
    <Avatar
      {...rest}
      alt={user.username || "Nameless user"}
      imageSrc={props.user.avatarUrl}
      indicator={indicator}
    />
  );
}
