import { Metadata } from "next";
import { Buttons } from "./buttons";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="w-full h-full mx-auto flex flex-col">
      <div className="flex flex-col gap-3">
        <Buttons />
      </div>
    </div>
  );
}
