"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTokenStore } from "@/stores/useTokenStore";
import { Button } from "@/ui/button";

export default function Logout() {
  const [hasTokens, setTokens] = useTokenStore((s) => [
    !!(s.accessToken && s.refreshToken),
    s.setTokens,
  ]);
  const { replace } = useRouter();

  useEffect(() => {
    if (!hasTokens) {
      replace("/");
    }
  }, [hasTokens, replace]);

  return (
    <div className="flex w-full h-full justify-center items-center">
      <Button
        onClick={() => setTokens({ accessToken: "", refreshToken: "" })}
        className="underline"
      >
        click here if you don't get automatically redirected
      </Button>
    </div>
  );
}
