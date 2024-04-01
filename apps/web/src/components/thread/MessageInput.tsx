import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { Input } from "@/ui/input";
import { User } from "@spek/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  };

  return (
    <>
      {currentUser ? (
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Send a message"
            autoFocus
            disabled={isLoading}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </form>
      ) : (
        <div className="px-3">
          <div
            className="bg-alabaster-600 px-3 py-3 text-xl text-center rounded-md cursor-pointer"
            onClick={() => {
              push("/login");
            }}
          >
            <p>Sign up to start chatting in this thread</p>
          </div>
        </div>
      )}
    </>
  );
};
