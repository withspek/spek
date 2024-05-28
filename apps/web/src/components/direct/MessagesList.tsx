import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Avatar } from "@spek/ui";
import { User } from "@spek/client";
import { format } from "date-fns";
import { useState } from "react";

interface MessagesListProps {
  dmId: string;
}

interface PageProps {
  dmId: string;
  cursor: number;
  user: User;
  onLoadMore: (cursor: number) => void;
  isLastPage: boolean;
  isOnlyPage: boolean;
}

const Page: React.FC<PageProps> = ({
  dmId,
  cursor,
  isLastPage,
  isOnlyPage,
  user,
  onLoadMore,
}) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getDmMessages", cursor],
    { staleTime: Infinity, refetchOnMount: "always" },
    [dmId, cursor]
  );

  if (isLoading) {
    return <div>loading..</div>;
  }

  if (!data) {
    return null;
  }

  if (isOnlyPage && !isLoading && !data.messages.length) {
    return <div>No messages yet</div>;
  }

  return (
    <>
      {data.messages.map((m, idx) => (
        <div
          key={idx}
          className={`flex flex-1 items-center px-3 rounded-md py-4 gap-3`}
        >
          <Avatar
            imageSrc={m.user.avatarUrl}
            size={"md"}
            alt={m.user.displayName}
            title={`@${m.user.username}`}
          />
          <div className="flex flex-col gap-1">
            <p className="font-bold text-sm">
              {m.user.displayName}
              <span className="font-normal ml-3 text-sm">
                {format(new Date(m.user.inserted_at), "MMM dd HH:mm a")}
              </span>
            </p>
            <p>{m.text}</p>
          </div>
        </div>
      ))}
      {data.nextCursor && isLastPage ? (
        <div className="flex w-full justify-center">
          <button
            type="button"
            className="bg-alabaster-600 px-3 rounded-md"
            onClick={() => {
              onLoadMore(data.nextCursor!);
            }}
          >
            load more
          </button>
        </div>
      ) : null}
    </>
  );
};

export const MessagesList: React.FC<MessagesListProps> = ({ dmId }) => {
  const { user } = useConn();
  const [cursors, setCursors] = useState<number[]>([0]);

  return (
    <div className="flex flex-col-reverse gap-1">
      {cursors.map((c, i) => (
        <Page
          key={c}
          cursor={c}
          user={user}
          dmId={dmId}
          onLoadMore={(nc) => setCursors([...cursors, nc])}
          isLastPage={i === cursors.length - 1}
          isOnlyPage={cursors.length === 1}
        />
      ))}
    </div>
  );
};
