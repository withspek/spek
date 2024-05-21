import { UserDm } from "@spek/client";

import { useTypeSafePrefetch } from "@/hooks/useTypeSafePrefetch";
import { useRouter } from "next/navigation";
import { useConn } from "@/hooks/useConn";
import { Avatar } from "@spek/ui";

interface Props {
  conversations: UserDm[];
}

export const ConversationsList: React.FC<Props> = ({ conversations }) => {
  const { user } = useConn();
  const prefetch = useTypeSafePrefetch();
  const { push } = useRouter();

  return (
    <div className="flex flex-col gap-4 mt-4">
      {conversations.length > 0 ? (
        conversations.map((c) => (
          <div
            key={c.id}
            className="flex gap-4 items-center cursor-pointer"
            onClick={() => {
              prefetch(["joinDmAndGetInfo", c.id], [c.id]);

              push(`/direct/${c.id}`);
            }}
          >
            <div className="flex -space-x-4 rtl:space-x-reverse">
              {c.peoplePreviewList
                .filter((u) => u.id !== user.id)
                .map((p) => (
                  <Avatar
                    key={p.id}
                    alt={p.displayName}
                    imageSrc={p.avatarUrl}
                  />
                ))}
            </div>
            <div>
              <p className="font-bold">
                {c.peoplePreviewList
                  .filter((u) => u.id !== user.id)
                  .map((p) => p.displayName)
                  .join("")}
              </p>
            </div>
          </div>
        ))
      ) : (
        <>
          <p>You have no direct messages yet</p>
          <p>Tip: Visit a user profile and message them</p>
        </>
      )}
    </div>
  );
};
