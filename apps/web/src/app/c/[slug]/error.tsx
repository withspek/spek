"use client";

import { Button } from "@spek/ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & string;
  reset: () => void;
}) {
  const { push } = useRouter();
  useEffect(() => {
    // log into the logging service

    console.log(error);
  }, [error]);

  if (error.message) {
    console.log(error.message);
    const data = JSON.parse(error.message);

    return (
      <div>
        <p>{data.error}</p>
        <button onClick={() => push("/home")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <p>{error}</p>
      <Button onClick={() => reset()}>Try again</Button>
      <Button onClick={() => push("/home")}>Go Home</Button>
    </div>
  );
}
