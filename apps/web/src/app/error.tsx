"use client";

import { Button } from "@/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: string;
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // log into the logging service

    console.log(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button onClick={() => router.push("/home")}>Go Back</Button>
      </div>
    </div>
  );
}
