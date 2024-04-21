"use client";

import { useTokenStore } from "@/stores/useTokenStore";
import { Buttons } from "./buttons";
import { useSaveTokens } from "@/hooks/useSaveTokens";
import { useConn } from "@/hooks/useConn";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  useSaveTokens();
  const conn = useConn();
  const router = useRouter();
  const hasTokens = useTokenStore((s) => !!(s.accessToken && s.refreshToken));

  useEffect(() => {
    if (hasTokens || conn.user) {
      router.push("/home");
    }
  }, [hasTokens, conn, router]);
  return (
    <div className="w-full h-full mx-auto flex flex-col">
      <div className="flex flex-col gap-3">
        <Buttons />
      </div>
    </div>
  );
}
