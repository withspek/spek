import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { Input } from "@/ui/input";
import React, { useState } from "react";

interface InputProps {
  dmId: string;
}

export const MessageInput: React.FC<InputProps> = ({ dmId }) => {
  const [message, setMessage] = useState("");
  const { mutateAsync } = useTypeSafeMutation("createDirectMessage");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await mutateAsync([{ dmId, text: message }]);

    setMessage("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Send message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete="off"
          autoFocus={true}
        />
      </form>
    </div>
  );
};
