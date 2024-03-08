import { CheckAuth } from "@/components/check-auth";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CheckAuth>{children}</CheckAuth>;
}
