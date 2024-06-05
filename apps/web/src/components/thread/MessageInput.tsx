import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { debounce } from "lodash";
import { User } from "@spek/client";
import { Icon } from "@spek/ui";

import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { Input } from "@/ui/input";

interface MessageInputProps {
  threadId: string;
  communityId: string;
  currentUser: User;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  currentUser,
  threadId,
  communityId,
}) => {
  const [text, setText] = useState<string>("");
  const ref = useRef<HTMLInputElement>(null);
  const { push } = useRouter();
  const { mutateAsync, isLoading } = useTypeSafeMutation("createThreadMessage");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      text,
      threadId: threadId,
      communityId: communityId,
      userId: currentUser.id,
    };

    await mutateAsync([data]);

    setText("");
    ref.current!.focus();
  };

  return (
    <>
      {currentUser ? (
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Send a message"
            autoFocus
            ref={ref}
            disabled={isLoading}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </form>
      ) : (
        <div className="px-3">
          <div
            className="flex justify-center gap-5 items-center bg-primary-800 px-3 py-3 text-lg text-center rounded-md cursor-pointer"
            onClick={() => {
              push("/login");
            }}
          >
            <Icon name="rocket" />
            <p>Sign up to start chatting in this thread</p>
          </div>
        </div>
      )}
    </>
  );
};
