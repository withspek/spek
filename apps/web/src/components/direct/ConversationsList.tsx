import { UserDm } from "@spek/client";
import { useTypeSafePrefetch } from "@/hooks/useTypeSafePrefetch";
import { useRouter } from "next/navigation";
import { useConn } from "@/hooks/useConn";

interface Props {
  conversations: UserDm[];
}

export const ConversationsList: React.FC<Props> = ({ conversations }) => {
  const { user } = useConn();
  const prefetch = useTypeSafePrefetch();
  const { push } = useRouter();

  return (
    <div className="flex flex-col gap-4 mt-4">
      {conversations.map((c) => (
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
                <div className="relative" key={p.id}>
                  <img
                    className="w-10 h-10 border-2 border-alabaster-300 rounded-full"
                    src={p.avatarUrl}
                    alt={p.displayName}
                  />
                  {p.online ? (
                    <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                  ) : null}
                </div>
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
      ))}
    </div>
  );
};
