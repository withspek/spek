"use client";

import { CompassIcon } from "@/icons";
import { useTokenStore } from "@/stores/useTokenStore";
import { Button } from "@/ui/button";
import { apiUrl } from "@/utils/constants";
import { useRouter } from "next/navigation";
import React from "react";

export const Buttons: React.FC = () => {
  const { push } = useRouter();

  return (
    <>
      <Button
        onClick={() => {
          window.location.href = `${apiUrl}/auth/gitlab`;
        }}
      >
        Login with Gitlab
      </Button>
      <Button
        color="primary"
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
      </Button>
    </>
  );
};
