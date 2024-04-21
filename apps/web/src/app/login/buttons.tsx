"use client";

import { CompassIcon, UserSharingIcon } from "@/icons";
import { useTokenStore } from "@/stores/useTokenStore";
import { Button } from "@/ui/button";
import { apiUrl, loginNextPathKey, prod } from "@/utils/constants";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

interface LoginButtonProps {
  children: [React.ReactNode, React.ReactNode];
  dev?: true;
  onClick?: () => void;
  oauthUrl?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  children,
  dev,
  oauthUrl,
  onClick,
}) => {
  const params = useSearchParams();
  const nextPath = params.get("next");

  const clickHandler = useCallback(() => {
    if (typeof nextPath === "string" && nextPath) {
      try {
        localStorage.setItem(loginNextPathKey, nextPath);
      } catch {}
    }

    window.location.href = oauthUrl as string;
  }, [nextPath, oauthUrl]);

  return (
    <Button
      color={dev ? "default" : "primary"}
      onClick={oauthUrl ? clickHandler : onClick}
    >
      {children[0]}
      {children[1]}
    </Button>
  );
};

export const Buttons: React.FC = () => {
  const { push } = useRouter();

  return (
    <>
      <LoginButton oauthUrl={`${apiUrl}/auth/github`}>
        <UserSharingIcon />
        Login with Github
      </LoginButton>
      <LoginButton oauthUrl={`${apiUrl}/auth/gitlab`}>
        <UserSharingIcon />
        Login with Gitlab
      </LoginButton>
      {!prod ? (
        <LoginButton
          dev
          onClick={async () => {
            const username = prompt("username");
            const resp = await fetch(
              `${apiUrl}/dev/test-info?username=${username}`
            );

            const d = await resp.json();

            useTokenStore.getState().setTokens({
              accessToken: d.accessToken,
              refreshToken: d.refreshToken,
            });

            push("/");
          }}
        >
          <CompassIcon />
          Create test user
        </LoginButton>
      ) : null}
    </>
  );
};
