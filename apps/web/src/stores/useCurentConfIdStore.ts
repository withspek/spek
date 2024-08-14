import { create } from "zustand";
import { combine } from "zustand/middleware";

type Fn = (currentConfId: string | null) => string | null;

export const useCurrentConfIdStore = create(
  combine(
    {
      currentConfId: null as string | null,
    },
    (set, get) => ({
      set,
      setCurrentConfId: (currentConfIdOrFn: string | Fn | null) => {
        const id = get().currentConfId;

        const newId =
          typeof currentConfIdOrFn == "function"
            ? currentConfIdOrFn(id)
            : currentConfIdOrFn;

        set({ currentConfId: newId });
      },
    })
  )
);
