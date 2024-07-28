import React, { useRef, useState } from "react";

import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { Input } from "@/ui/input";
import { useConversationStore } from "@/stores/useConversationStore";
import { toast } from "@spek/ui";

interface InputProps {
  lodgeId: string;
}

export const MessageInput: React.FC<InputProps> = ({ lodgeId }) => {
  const { message, setMessage } = useConversationStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number>(0);
  const { mutateAsync } = useTypeSafeMutation("createLodgeMessage");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Date.now() - lastMessageTimestamp <= 2000) {
      toast("Wait 2 seconds before sending another message");
      return;
    }

    await mutateAsync([{ lodgeId, text: message }]);

    setMessage("");
    setLastMessageTimestamp(Date.now());
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
