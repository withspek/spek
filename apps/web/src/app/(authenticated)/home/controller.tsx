"use client";

import React, { useState } from "react";

import { ThreadsList } from "./ThreadsList";

interface ControllerProps {}

export const HomeController: React.FC<ControllerProps> = () => {
  const [cursors, setCursors] = useState<number[]>([0]);

  return (
    <div className="flex flex-col flex-1">
      <h2>Feed</h2>
      <div className="flex flex-col gap-4 my-3">
        {cursors.map((c, i) => (
          <ThreadsList
            key={c}
            cursor={c}
            onLoadMore={(nc) => setCursors([...cursors, nc])}
            isLastPage={i === cursors.length - 1}
            isOnlyPage={cursors.length === 1}
          />
        ))}
      </div>
    </div>
  );
};
