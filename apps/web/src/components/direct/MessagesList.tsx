import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { useState } from "react";

interface MessagesListProps {
  dmId: string;
}

interface PageProps {
  dmId: string;
  cursor: number;
  onLoadMore: (cursor: number) => void;
  isLastPage: boolean;
  isOnlyPage: boolean;
}

const Page: React.FC<PageProps> = ({
  dmId,
  cursor,
  isLastPage,
  isOnlyPage,
  onLoadMore,
}) => {
  const { data, isLoading } = useTypeSafeQuery(["getDmMessages", dmId], {}, [
    dmId,
    cursor,
  ]);

  if (isLoading) {
    return <div>loading..</div>;
  }

  if (isOnlyPage && !isLoading && !data?.messages.length) {
    return <div>No messages yet</div>;
  }

  return (
    <>
      {isLastPage && data?.nextCursor ? (
        <button
          className="bg-alabaster-600 px-3"
          onClick={() => onLoadMore(data!.nextCursor!)}
        >
          load more
        </button>
      ) : null}
      {data?.messages.map((m) => (
        <p key={m.id}>
          <span className="font-bold">~{m.user.displayName}: </span>
          {m.text}
        </p>
      ))}
    </>
  );
};

export const MessagesList: React.FC<MessagesListProps> = ({ dmId }) => {
  const [cursors, setCursors] = useState<number[]>([0]);

  return (
    <div>
      {cursors.map((c, i) => (
        <Page
          key={c}
          cursor={c}
          dmId={dmId}
          onLoadMore={(nc) => setCursors([...cursors, nc])}
          isLastPage={i === cursors.length - 1}
          isOnlyPage={cursors.length === 1}
        />
      ))}
    </div>
  );
};
