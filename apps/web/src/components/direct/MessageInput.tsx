import { Input } from "@/ui/input";
import React from "react";

interface InputProps {}

export const MessageInput: React.FC<InputProps> = () => {
  return (
    <div>
      <Input
        placeholder="Send message"
        name="message"
        autoComplete="off"
        autoFocus={true}
      />
    </div>
  );
};
