import { Metadata } from "next";
import { DirectMessagePageController } from "./controller";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Direct",
};

export default function DirectMessagesPage() {
  return (
    <>
      <Header />
      <DirectMessagePageController />
    </>
  );
}
