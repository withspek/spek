import { LodgeMessage } from "@spek/client";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useConversationStore = create(
  combine(
    {
      open: false,
      messages: [] as LodgeMessage[],
      newUnreadMessages: false,
      message: "" as string,
      isChatScrolledToTop: false,
      frozen: false,
    },
    (set) => ({
      addMessage: (m: LodgeMessage) =>
        set((s) => ({
          newUnreadMessages: !s.open,
          messages: [m, ...s.messages],
        })),

      setMessages: (messages: LodgeMessage[]) => set((s) => ({ messages })),
      toggleOpen: () =>
        set((s) => {
          if (s.open) {
            return {
              open: false,
              newUnreadMessages: false,
            };
          } else {
            return {
              open: true,
              newUnreadMessages: false,
            };
          }
        }),
      setMessage: (message: string) => set({ message }),
      setOpen: (open: boolean) => set((s) => ({ ...s, open })),
      setIsChatScrolledToTop: (isChatScrolledToTop: boolean) =>
        set({ isChatScrolledToTop }),
      toggleFrozen: () => set((s) => ({ frozen: !s.frozen })),
    })
  )
);
