import { useTokenStore } from "@/stores/useTokenStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const useVerifyLoggedIn = () => {
  const { replace } = useRouter();
  const asPath = usePathname();
  const hasTokens = useTokenStore((s) => !!(s.accessToken && s.refreshToken));

  useEffect(() => {
    if (!hasTokens) {
      replace(`/?next=${asPath}`);
    }
  }, [hasTokens, asPath, replace]);

  return hasTokens;
};
