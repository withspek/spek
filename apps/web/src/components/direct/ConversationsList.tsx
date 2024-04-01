import Link from "next/link";

import { Avatar } from "@/ui/avatar";
import { UserDm } from "@spek/client";
import { useTypeSafePrefetch } from "@/hooks/useTypeSafePrefetch";
import { useRouter } from "next/navigation";

interface Props {
  conversations: UserDm[];
}

export const ConversationsList: React.FC<Props> = ({ conversations }) => {
  const prefetch = useTypeSafePrefetch();
  const { push } = useRouter();

  return (
    <div>
      {conversations.map((c) => (
        <div
          key={c.id}
          onClick={() => {
            prefetch(["joinDmAndGetInfo", c.id], [c.id]);

            push(`/direct/${c.id}`);
          }}
        >
          <Avatar src="" isOnline={true} size="md" />
          <div>
            <p className="font-bold">
              {c.peoplePreviewList.map((p) => p.displayName).join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
