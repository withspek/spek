"use client";

import React from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { useRouter } from "next/navigation";
import { Badge } from "@spek/ui";

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
            className="flex flex-col bg-primary-800 hover:bg-primary-950 px-5 py-4 cursor-pointer rounded-lg"
            onClick={() => push(`c/${c.slug}`)}
          >
            <div className="flex w-full justify-between">
              <p className="font-bold uppercase">{c.name}</p>
              <Badge withDot={true}>{c.memberCount} people</Badge>
            </div>
            <p className="text-primary-300">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
