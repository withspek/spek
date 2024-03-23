import { Metadata } from "next";
import { HomeController } from "./page-controller";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <div>
      <HomeController />
    </div>
  );
}
