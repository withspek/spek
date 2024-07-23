import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "./providers";
import { ProgressBar } from "@/components/ProgressBar";

export const metadata: Metadata = {
  metadataBase: new URL("https://spek.vercel.app"),
  title: { default: "Spek - Powerful commmunities", template: "%s ║ Spek" },
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
        <div id="__app">
          <ProgressBar />
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
