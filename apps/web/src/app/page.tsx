"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Buttons } from "./login/buttons";
import { useTokenStore } from "@/stores/useTokenStore";
import { ParticlesComp } from "@/components/Particles";
import { useSaveTokens } from "@/hooks/useSaveTokens";

export default function Home() {
  useSaveTokens();
  const router = useRouter();
  const hasTokens = useTokenStore((s) => !!(s.accessToken && s.refreshToken));

  useEffect(() => {
    if (hasTokens) {
      router.push("/home");
    }
  }, [hasTokens, router]);

  return (
    <>
      <ParticlesComp />
      <main
        className="grid w-full h-full"
        style={{ gridTemplateRows: "1fr auto 1fr" }}
      >
        <div className="hidden sm:flex" />
        <div className="md:hidden flex justify-center w-full mt-6">
          <h1 className="text-3xl">Spek</h1>
        </div>
        <div className="flex flex-col gap-4 mx-auto w-56">
          <h1 className="text-balance text-center">Login</h1>
          <Buttons />
        </div>
        <div className="flex w-full justify-between items-end px-5 py-4">
          <div className="sm:flex hidden">
            <h1>Spek</h1>
          </div>
          <div className="flex gap-4">
            <a
              className="text-base hover:underline"
              href="https://irere.vercel.app/blog/why-spek"
            >
              About
            </a>
            <a
              href="https://irere.vercel.app/blog/"
              className="text-base hover:underline"
            >
              Blog
            </a>
            <a
              href="https://github.com/irere123/spek?tab=License-1-ov-file"
              className="text-base hover:underline"
            >
              Terms
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
