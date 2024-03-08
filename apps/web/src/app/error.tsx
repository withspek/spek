"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: string;
  reset: () => void;
}) {
  useEffect(() => {
    // log into the logging servince
    console.log(error);
  }, [error]);
  return (
    <div>
      <p>Something went wrong</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
