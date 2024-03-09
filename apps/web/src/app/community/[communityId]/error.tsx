"use client";

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
    const data = JSON.parse(error.message);

    return (
      <div>
        <p>{data.error}</p>
        <button onClick={() => push("/home")}>Go Home</button>
      </div>
    );
  }

  return (
    <div>
      <p>{error}</p>
      <button onClick={() => reset()}>Try again</button>
      <button onClick={() => push("/home")}>Go Home</button>
    </div>
  );
}
