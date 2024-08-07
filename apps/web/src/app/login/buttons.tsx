"use client";

import React, { useCallback } from "react";
import { API_URL } from "@spek/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Icon } from "@spek/ui";

import { useTokenStore } from "@/stores/useTokenStore";
import { loginNextPathKey, prod } from "@/utils/constants";

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
      color={dev ? "secondary" : "primary"}
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
      <LoginButton oauthUrl={`${API_URL}/auth/github`}>
        <Icon name="github" width={16} height={16} />
        Continue with Github
      </LoginButton>
      <LoginButton oauthUrl={`${API_URL}/auth/gitlab`}>
        <Icon name="gitlab" width={16} height={16} />
        Continue with Gitlab
      </LoginButton>
      {!prod ? (
        <LoginButton
          dev
          onClick={async () => {
            const username = prompt("username");
            const resp = await fetch(
              `${API_URL}/dev/test-info?username=${username}`
            );

            const d = await resp.json();

            useTokenStore.getState().setTokens({
              accessToken: d.accessToken,
              refreshToken: d.refreshToken,
            });

            push("/home");
          }}
        >
          <Icon name="bug" width={16} height={16} />
          Create test user
        </LoginButton>
      ) : null}
    </>
  );
};
