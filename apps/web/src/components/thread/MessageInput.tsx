import { useRef, useState } from "react";
import { Icon } from "@spek/ui";

import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { Input } from "@/ui/input";
import { useConn } from "@/hooks/useConn";

interface MessageInputProps {
  threadId: string;
  communityId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  threadId,
  communityId,
}) => {
  const { user } = useConn();
  const [text, setText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync, isLoading } = useTypeSafeMutation("createThreadMessage");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      text,
      threadId: threadId,
      communityId: communityId,
      userId: user.id,
    };

    await mutateAsync([data]);

    setText("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-center bg-primary-800 px-3 rounded-md"
    >
      <Input
        placeholder="Send a message"
        autoFocus={true}
        ref={inputRef}
        disabled={isLoading}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <Icon name="smile" />
    </form>
  );
};
