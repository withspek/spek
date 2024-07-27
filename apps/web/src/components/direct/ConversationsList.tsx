import { Lodge } from "@spek/client";

import { useTypeSafePrefetch } from "@/hooks/useTypeSafePrefetch";
import { useRouter } from "next/navigation";
import { useConn } from "@/hooks/useConn";
import { UserAvatarGroup } from "@spek/ui";

interface Props {
  conversations: Lodge[];
}

export const ConversationsList: React.FC<Props> = ({ conversations }) => {
  const { user } = useConn();
  const prefetch = useTypeSafePrefetch();
  const { push } = useRouter();

  return (
    <div className="flex flex-col gap-4 mt-4">
      {conversations.length! > 0 ? (
        conversations.map((c) => (
          <div
            key={c.id}
            className="flex gap-4 items-center cursor-pointer"
            onClick={() => {
              prefetch(["joinLodgeAndGetInfo", c.id], [c.id]);

              push(`/direct/${c.id}`);
            }}
          >
            <div className="flex -space-x-4 rtl:space-x-reverse">
              <UserAvatarGroup
                size="md"
                users={c.recipients.filter((r) => r.id !== user.id)}
                truncateAfter={2}
              />
            </div>
            <div>
              <p className="font-bold">
                {c.recipients
                  .slice(0, 4)
                  .filter((u) => u.id !== user.id)
                  .map((p) => p.displayName)
                  .join(",")}
              </p>
            </div>
          </div>
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
