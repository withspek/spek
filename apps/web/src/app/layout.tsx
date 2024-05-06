import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "./providers";
import { CenterLayout } from "@/components/CenterLayout";
import { ProgressBar } from "@/components/ProgressBar";

export const metadata: Metadata = {
  metadataBase: new URL("https://spek.vercel.app"),
  title: { default: "Spek", template: "%s ― Spek" },
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
        <ProgressBar />
        <Providers>
          <CenterLayout>{children}</CenterLayout>
        </Providers>
      </body>
    </html>
  );
}
