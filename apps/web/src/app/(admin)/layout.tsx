"use client";

import { useConn } from "@/hooks/useConn";
import { HomeIcon } from "@/icons";
import { prod } from "@/utils/constants";
import { Icon } from "@spek/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Header: React.FC = () => {
  return (
    <div className="flex gap-6 mb-5 mt-3">
      <Link href={"/admin"}>
        <HomeIcon />
      </Link>
      <Link href={"/communities"}>
        <Icon name="users" />
      </Link>
      <Link href={"/logs"}>
        <Icon name="book" />
      </Link>
    </div>
  );
};

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useConn();
  const { replace } = useRouter();

  useEffect(() => {
    if (user.username !== "irere123" && prod) {
      replace("/home");
    }
  }, []);

  if (user.username !== "irere123" && prod) {
    return null;
  }

  return (
    <main className="flex flex-col w-full h-full items-center overflow-y-auto">
      <Header />
      {children}
    </main>
  );
}
