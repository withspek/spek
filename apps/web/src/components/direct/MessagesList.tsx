import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

interface MessagesListProps {
  dmId: string;
}

export const MessagesList: React.FC<MessagesListProps> = ({ dmId }) => {
  const { data, isLoading } = useTypeSafeQuery(["getDmMessages", dmId], {}, [
    dmId,
  ]);

  if (isLoading) {
    return <div>loading..</div>;
  }

  return (
    <div>
      {data?.messages.map((message) => (
        <p key={message.id}>
          <span className="font-bold">~{message.user.displayName}: </span>
          {message.text}
        </p>
      ))}
    </div>
  );
};
