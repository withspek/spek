import React, { useRef, useState } from "react";

import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { Input } from "@/ui/input";

interface InputProps {
  dmId: string;
}

export const MessageInput: React.FC<InputProps> = ({ dmId }) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync } = useTypeSafeMutation("createDirectMessage");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await mutateAsync([{ dmId, text: message }]);

    setMessage("");
    inputRef.current?.focus();
  };

  return (
    <div>
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
