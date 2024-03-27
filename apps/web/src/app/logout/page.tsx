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
    <div>
      <Button onClick={() => setTokens({ accessToken: "", refreshToken: "" })}>
        click hare if you don't get automatically redirected
      </Button>
    </div>
  );
}
