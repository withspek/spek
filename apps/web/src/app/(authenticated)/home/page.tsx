import { Metadata } from "next";
import { HomeController } from "./controller";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <HomeController />
    </>
  );
}
