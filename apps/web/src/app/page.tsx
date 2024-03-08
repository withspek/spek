"use client";

import { Navbar } from "@/components/navbar";
import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

export default function Home() {
  const { data, isLoading } = useTypeSafeQuery("getUsers");

  if (isLoading) {
    return null;
  }

  return (
    <main className="flex gap-16 sm:w-full md:w-md lg:w-lg xl:w-xl sm:px-3 lg:px-10 py-3">
      <Navbar />
      <div className="w-full h-full">
        {data?.map((u: any, idx: number) => {
          return (
            <div key={idx}>
              <p>{u.username}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
