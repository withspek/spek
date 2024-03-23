import { Authenticated } from "@/components/check-auth";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Authenticated>{children}</Authenticated>;
}
