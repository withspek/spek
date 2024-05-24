"use client";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import Link from "next/link";

export default function AdminCommunities() {
  const { data, isLoading } = useTypeSafeQuery("getAllCommnunities");

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {data?.map((d) => (
        <Link
          href={`/u/${d.id}`}
          key={d.id}
          className="flex gap-4 bg-primary-800 px-3 py-4 rounded-lg"
        >
          <div>
            <p>{d.name}</p>
            <p>{d.memberCount}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
