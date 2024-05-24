"use client";

import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Avatar } from "@spek/ui";
import Link from "next/link";

export default function AdminPage() {
  const { data, isLoading } = useTypeSafeQuery("getAllUsers");

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 mb-4">
      {data?.map((d) => (
        <Link
          href={`/u/${d.id}`}
          key={d.id}
          className="flex gap-4 bg-primary-900 px-3 py-4 rounded-lg"
        >
          <Avatar
            imageSrc={d.avatarUrl}
            alt={d.displayName}
            title={d.username}
          />
          <div>
            <p className="text-primary-50">{d.username}</p>
            <p className="text-primary-200">{d.bio}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
