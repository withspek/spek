import { classNames } from "@spek/lib";

import { Avatar } from "./Avatar";

export type AvatarGroupProps = {
  size: "sm" | "lg" | "md" | "mdLg";
  items: {
    image: string;
    title?: string;
    alt?: string;
    href?: string | null;
  }[];
  className?: string;
  truncateAfter?: number;
};

const sizesPropsBySize = {
  sm: "w-6 h-6 min-w-6 min-h-6", // 24px
  md: "w-8 h-8 min-w-8 min-h-8", // 32px
  mdLg: "w-10 h-10 min-w-10 min-h-10", //40px
  lg: "w-16 h-16 min-w-16 min-h-16", // 64px
} as const;

export const AvatarGroup = function AvatarGroup({
  size = "sm",
  ...props
}: AvatarGroupProps) {
  const LENGTH = props.items.length;
  const truncateAfter = props.truncateAfter || 4;
  /**
   * First, filter all the avatars object that have image
   * Then, slice it until before `truncateAfter` index
   */
  const displayedAvatars = props.items
    .filter((avatar) => avatar.image)
    .slice(0, truncateAfter);
  const numTruncatedAvatars = LENGTH - displayedAvatars.length;

  if (!displayedAvatars.length) return <></>;

  return (
    <ul className={classNames("flex items-center", props.className)}>
      {displayedAvatars.map((item, idx) => (
        <li key={idx} className="-mr-3 inline-block">
          <Avatar
            data-testid="avatar"
            className="border-subtle"
            imageSrc={item.image}
            title={item.title}
            alt={item.alt || ""}
            size={size}
            href={item.href}
          />
        </li>
      ))}
      {numTruncatedAvatars > 0 && (
        <li
          className={classNames(
            "bg-primary-800 relative -mr-1 inline-flex justify-center  overflow-hidden rounded-full",
            sizesPropsBySize[size]
          )}
        >
          <span
            className={classNames(
              " text-primary-100 m-auto flex h-full w-full items-center justify-center text-center",
              sizesPropsBySize[size]
            )}
          >
            +{numTruncatedAvatars}
          </span>
        </li>
      )}
    </ul>
  );
};
