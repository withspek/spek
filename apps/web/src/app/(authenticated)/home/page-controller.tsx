"use client";

import React from "react";

import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { useRouter } from "next/navigation";

interface ControllerProps {}

export const HomeController: React.FC<ControllerProps> = () => {
  const { user } = useConn();
  const { push } = useRouter();
  const { data, isLoading } = useTypeSafeQuery("getTopCommunities");

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl">{user.displayName}</h2>
      <p>{user.gitlabUrl}</p>
      <img src={user.avatarUrl} alt={user.displayName} />
      <div className="flex flex-col gap-4 mt-3">
        {data?.communities.map((c) => (
          <div
            key={c.id}
            className="flex flex-col bg-alabaster-950 border border-alabaster-600 px-5 py-4"
            onClick={() => push(`community/${c.id}`)}
          >
            <p>{c.name}</p>
            <p>{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
