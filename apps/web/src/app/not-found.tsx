"use client";

import { Button, Icon } from "@spek/ui";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const { back } = useRouter();

  return (
    <div className="flex w-full h-full gap-3 flex-col justify-center items-center">
      <h2 className="font-semibold rotate-1">404 Not Found</h2>
      <p className="font-medium">Could not find requested resource</p>
      <Button startIcon={<Icon name="arrow-left" />} onClick={() => back()}>
        Go back
      </Button>
    </div>
  );
}
