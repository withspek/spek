"use client";

import React from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { useRouter } from "next/navigation";

interface ControllerProps {}

export const HomeController: React.FC<ControllerProps> = () => {
  const { push } = useRouter();
  const { data, isLoading } = useTypeSafeQuery("getTopCommunities");

  if (isLoading) {
    return <div>loading....</div>;
  }

  return (
    <div className="flex flex-col flex-1">
      <h2>Feed</h2>
      <div className="flex flex-col gap-4 mt-3">
        {data?.communities.map((c) => (
          <div
            key={c.id}
            className="flex flex-col bg-alabaster-950 border border-alabaster-600 px-5 py-4 cursor-pointer rounded-lg"
            onClick={() => push(`c/${c.slug}`)}
          >
            <p className="font-bold">{c.name}</p>
            <p>{c.description}</p>
            <p className="text-alabaster-600">
              <span className="text-alabaster-100">{c.memberCount}</span>{" "}
              members
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
