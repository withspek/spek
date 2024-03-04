"use client";

import { Buttons } from "./buttons";
import { useSaveTokens } from "@/hooks/useSaveTokens";

export default function LoginPage() {
  useSaveTokens();

  return (
    <div className="w-full h-full mx-auto flex flex-col">
      <div className="flex flex-col gap-3">
        <Buttons />
      </div>
    </div>
  );
}
