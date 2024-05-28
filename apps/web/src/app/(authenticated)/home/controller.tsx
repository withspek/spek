"use client";

import React from "react";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import Link from "next/link";
import { CenterLoader } from "@/components/CenterLoader";
import { Badge } from "@spek/ui";

interface ControllerProps {}

export const HomeController: React.FC<ControllerProps> = () => {
  const { data, isLoading } = useTypeSafeQuery("getTopCommunities");

  if (isLoading) {
    return <CenterLoader />;
  }

  return (
    <div className="flex flex-col flex-1">
      <h2>Feed</h2>
      <div className="flex flex-col gap-4 mt-3">
        {data?.communities.map((comm) => (
          <Link key={comm.id} href={`/c/${comm.slug}`}>
            <div className="bg-primary-900 rounded-md px-3 py-4 ">
              <p className="font-bold uppercase">{comm.name}</p>
              <p className="text-primary-300">{comm.description}</p>
              <Badge variant="success">{comm.memberCount} Members</Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
