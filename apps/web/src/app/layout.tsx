import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { CenterLayout } from "@/components/CenterLayout";

export const metadata: Metadata = {
  title: { default: "Spek", template: "%s | Spek" },
  description: "Simple public communities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <CenterLayout>{children}</CenterLayout>
        </Providers>
      </body>
    </html>
  );
}
