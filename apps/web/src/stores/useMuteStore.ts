import { create } from "zustand";
import { combine } from "zustand/middleware";
import { useWakeLockStore } from "./useScreenWakeLockStore";

export const useMuteStore = create(
  combine(
    {
      muted: false,
    },
    (set) => ({
      // use this directly if you what you are doing
      // otherwise use useSetMute hook
      setInternalMute: (muted: boolean) => {
        if (muted) {
          useWakeLockStore.getState().releaseWakeLock();
        } else {
          useWakeLockStore.getState().requestWakeLock();
        }

        set({ muted });
      },
    })
  )
);
