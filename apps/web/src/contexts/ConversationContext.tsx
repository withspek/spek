import { Lodge } from "@spek/client";
import { createContext } from "react";

export const ConversationContext = createContext<{ conversation?: Lodge }>({
  conversation: undefined,
});
