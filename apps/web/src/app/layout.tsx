import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

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
      <body className="w-full h-full flex">
        <div className="flex gap-3 w-full h-full">
          <Navbar />
          <main className="flex grow-[2] w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
