"use client";

import { Navbar } from "@/components/navbar";
import ConnectionContext from "@/contexts/ConnectionContext";
import { useContext } from "react";
import { useQuery } from "react-query";

export default function Home() {
  const { data, isLoading }: { data: any; isLoading: boolean } =
    useQuery("/dev");
  const { conn } = useContext(ConnectionContext);

  if (isLoading) {
    return null;
  }

  console.log(conn?.user);

  return (
    <main className="flex gap-16 sm:w-full md:w-md lg:w-lg xl:w-xl sm:px-3 lg:px-10 py-3">
      <Navbar />
      <div className="w-full h-full">
        {data.map((u: any, idx: number) => {
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
