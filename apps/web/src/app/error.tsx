"use client";

import { Button, Icon } from "@spek/ui";
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
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex flex-col gap-4 sm:max-w-96 w-full justify-center items-center">
        <h2 className="text-balance text-center">Something went wrong!</h2>
        <p className="text-balance text-center text-primary-400">
          Attempt to recover by trying again or going back home
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              // Attempt to recover by trying to re-render the segment
              reset();
            }}
            startIcon={<Icon width={16} height={16} name="refresh-ccw" />}
          >
            Try again
          </Button>
          <Button
            onClick={() => router.push("/home")}
            startIcon={<Icon width={16} height={16} name="chevron-left" />}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
