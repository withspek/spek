import { Metadata } from "next";
import { Controller } from "./page-controller";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <div>
      <Controller />
    </div>
  );
}
