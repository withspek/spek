"use client";

import { CompassIcon } from "@/icons";
import { Button } from "@/ui/button";
import { apiUrl } from "@/utils/constants";
import React from "react";

export const Buttons: React.FC = () => {
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
        }}
      >
        <CompassIcon />
        Create test user
      </Button>
    </>
  );
};
