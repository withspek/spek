import React, { useRef } from "react";

import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { Input } from "@/ui/input";
import { useConversationStore } from "@/stores/useConversationStore";

interface InputProps {
  lodgeId: string;
}

export const MessageInput: React.FC<InputProps> = ({ lodgeId }) => {
  const { message, setMessage } = useConversationStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync } = useTypeSafeMutation("createLodgeMessage");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await mutateAsync([{ lodgeId, text: message }]);

    setMessage("");
    inputRef.current?.focus();
  };

  return (
    <div className="bottom-0 z-30 sticky bg-primary-950 py-2">
      <form
        className="flex gap-1 items-center bg-primary-800 pl-3 rounded-md"
        onSubmit={handleSubmit}
      >
        <Input
          placeholder="Send message"
          name="message"
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete="off"
          autoFocus={true}
        />
      </form>
    </div>
  );
};
