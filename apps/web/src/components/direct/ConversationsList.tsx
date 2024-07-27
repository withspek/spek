import { Lodge } from "@spek/client";
import { AvatarGroup, UserAvatar } from "@spek/ui";
import Link from "next/link";

import { useTypeSafePrefetch } from "@/hooks/useTypeSafePrefetch";
import { useConn } from "@/hooks/useConn";

interface Props {
  conversations: Lodge[];
}

export const ConversationsList: React.FC<Props> = ({ conversations }) => {
  const { user } = useConn();
  const prefetch = useTypeSafePrefetch();

  return (
    <div className="flex flex-col gap-4 mt-4">
      {conversations.length! > 0 ? (
        conversations.map((c) => (
          <Link
            key={c.id}
            href={`/direct/${c.id}`}
            className="flex gap-4 items-center cursor-pointer"
            onClick={() => {
              prefetch(["joinLodgeAndGetInfo", c.id], [c.id]);
            }}
          >
            <div className="flex -space-x-4 rtl:space-x-reverse">
              {c.recipients.length > 1 ? (
                <AvatarGroup
                  size="md"
                  items={c.recipients
                    .filter((r) => r.id !== user.id)
                    .map((r) => ({
                      image: r.avatarUrl,
                      alt: r.displayName,
                    }))}
                  truncateAfter={2}
                />
              ) : (
                <UserAvatar
                  size="md"
                  alt={c.recipients[0].displayName}
                  user={c.recipients[0]}
                />
              )}
            </div>
            <div>
              <p className="font-bold">
                {c.recipients.length > 1
                  ? c.recipients
                      .slice(0, 4)
                      .filter((u) => u.id !== user.id)
                      .map((p) => p.displayName)
                      .join(",")
                  : c.recipients[0].displayName}
              </p>
            </div>
          </Link>
        ))
      ) : (
        <>
          <p>You have no direct messages yet</p>
          <p>
            <span className="text-green-400">Tip: </span>Visit a user profile
            and message them or just create it here.
          </p>
        </>
      )}
    </div>
  );
};
