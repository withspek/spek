"use client";

import { useCurrentConfIdStore } from "@/stores/useCurentConfIdStore";
import React from "react";
import { MinimizedRoomCardController } from "./room/MinimizedRoomCardController";

export const RightBlock: React.FC = () => {
  const { currentConfId } = useCurrentConfIdStore();

  return (
    <div>
      {currentConfId ? (
        <MinimizedRoomCardController confId={currentConfId} />
      ) : null}
    </div>
  );
};
