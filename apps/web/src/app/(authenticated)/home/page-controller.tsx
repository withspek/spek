"use client";

import React from "react";

import { useConn } from "@/hooks/useConn";

interface ControllerProps {}

export const Controller: React.FC<ControllerProps> = () => {
  const { user } = useConn();

  return (
    <div>
      <h2 className="text-xl">{user.displayName}</h2>
      <p>{user.gitlabUrl}</p>
      <img src={user.avatarUrl} alt={user.displayName} />
    </div>
  );
};
