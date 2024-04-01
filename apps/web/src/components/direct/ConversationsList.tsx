import Link from "next/link";

import { Avatar } from "@/ui/avatar";
import { UserDm } from "@spek/client";

interface Props {
  conversations: UserDm[];
}

export const ConversationsList: React.FC<Props> = ({ conversations }) => {
  return (
    <div>
      {conversations.map((c) => (
        <Link href={`/direct/${c.id}`} key={c.id}>
          <Avatar src="" isOnline={true} size="md" />
          <div>
            <p className="font-bold">
              {c.peoplePreviewList.map((p) => p.displayName).join(", ")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};
