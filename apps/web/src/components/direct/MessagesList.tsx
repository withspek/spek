import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Message } from "./Message";

interface MessagesListProps {
  lodgeId: string;
}

interface PageProps {
  lodgeId: string;
  cursor: number;
  onLoadMore: (cursor: number) => void;
  isLastPage: boolean;
  isOnlyPage: boolean;
}

const Page: React.FC<PageProps> = ({
  lodgeId,
  cursor,
  isLastPage,
  isOnlyPage,
  onLoadMore,
}) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getLodgeMessages", cursor],
    { staleTime: Infinity, refetchOnMount: "always" },
    [lodgeId, cursor],
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
        <Message key={idx} message={m} />
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

export const MessagesList: React.FC<MessagesListProps> = ({ lodgeId }) => {
  const [cursors, setCursors] = useState<number[]>([0]);
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (!inView) {
      window.scroll({ behavior: "smooth", top: 0 });
    }
  }, [inView]);

  return (
    <div className="flex flex-col flex-1 justify-end overflow-y-auto">
      <div className="flex flex-col-reverse gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700 w-full overflow-x-hidden">
        {cursors.map((c, i) => (
          <Page
            key={c}
            cursor={c}
            lodgeId={lodgeId}
            onLoadMore={(nc) => setCursors([...cursors, nc])}
            isLastPage={i === cursors.length - 1}
            isOnlyPage={cursors.length === 1}
          />
        ))}
        <div ref={ref} />
      </div>
    </div>
  );
};
