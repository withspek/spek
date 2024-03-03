import { useTokenStore } from "@/stores/useTokenStore";
import { loginNextPathKey } from "@/utils/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useSaveTokens = () => {
  const params = useSearchParams();
  const { push } = useRouter();

  const errorParam = params.get("error");
  const accessTokenParam = params.get("accessToken");
  const refreshTokenParam = params.get("refreshToken");

  useEffect(() => {
    if (typeof errorParam == "string" && errorParam) {
      console.error(errorParam);
    }

    if (
      typeof accessTokenParam == "string" &&
      typeof refreshTokenParam == "string" &&
      accessTokenParam &&
      refreshTokenParam
    ) {
      useTokenStore.getState().setTokens({
        accessToken: accessTokenParam,
        refreshToken: refreshTokenParam,
      });

      let nextPath = "/";

      try {
        let loginNextPath = localStorage.getItem(loginNextPathKey);

        if (loginNextPath && loginNextPath.startsWith("/")) {
          nextPath = loginNextPath;
          localStorage.setItem(loginNextPathKey, "");
        }

        // redirect the user to the next page 100ms will be unnoticable
        setTimeout(() => push(nextPath), 100);
      } catch {}
    }
  }, [params]);
};
