import { Input } from "@/ui/input";
import { Thread, User } from "@spek/client";
import { useRouter } from "next/navigation";

interface MessageInputProps {
  thread: Thread;
  currentUser: User;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  currentUser,
  thread,
}) => {
  const { push } = useRouter();

  return (
    <>
      {currentUser ? (
        <div>
          <Input placeholder="Send a message" autoFocus />
        </div>
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
