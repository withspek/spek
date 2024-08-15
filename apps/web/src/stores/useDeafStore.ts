import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useDeafStore = create(
  combine({ deafened: false }, (set) => ({
    // if you know that you're doing call this
    // otherwise use useSetDeaf hook instead
    setInternalDeaf: (deafened: boolean) => {
      set({ deafened });
    },
  }))
);
