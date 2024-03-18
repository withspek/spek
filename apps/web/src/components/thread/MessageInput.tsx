import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { Input } from "@/ui/input";
import { Thread, User } from "@spek/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MessageInputProps {
  thread: Thread;
  currentUser: User;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  currentUser,
  thread,
}) => {
  const [text, setText] = useState<string>("");
  const { push } = useRouter();
  const { mutateAsync, isLoading } = useTypeSafeMutation("createThreadMessage");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      text,
      threadId: thread.id,
      userId: currentUser.id,
    };

    console.log(currentUser);

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
