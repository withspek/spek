"use client";

import Link from "next/link";
import { Avatar } from "@spek/ui";

import { CenterLoader } from "@/components/CenterLoader";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

export default function AdminPage() {
  const { data, isLoading } = useTypeSafeQuery("getAllUsers");

  if (isLoading) {
    return <CenterLoader />;
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
            title={d.displayName}
          />
          <div>
            <p className="text-primary-50">
              {d.username} - {d.online ? "Online" : "Offline"}
            </p>
            <p className="text-primary-200">{d.bio}</p>
            {d.email && <p className="text-primary-400">&gt;{d.email}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}
