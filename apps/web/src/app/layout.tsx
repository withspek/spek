import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spek",
  description: "Simple public communities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="sm:justify-center">{children}</body>
    </html>
  );
}
