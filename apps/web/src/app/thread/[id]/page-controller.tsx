"use client";

import React from "react";

interface ThreadPageControllerProps {
  threadId: string;
}

export const ThreadPageController: React.FC<ThreadPageControllerProps> = ({
  threadId,
}) => {
  return (
    <div>
      <p>Thread messages</p>
    </div>
  );
};
