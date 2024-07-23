"use client";

import { useVerifyLoggedIn } from "@/hooks/useVerifyLoggedIn";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!useVerifyLoggedIn()) {
    return null;
  }

  return <>{children}</>;
}
