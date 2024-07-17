import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { Input } from "@/ui/input";
import React, { useRef, useState } from "react";

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
      <form onSubmit={handleSubmit}>
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
