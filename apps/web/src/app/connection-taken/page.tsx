import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connection taken",
};

export default function ConnectionTakenPage() {
  return (
    <div className="flex justify-center w-full h-full">
      <p>
        Connection to has been taken by another client. If you opened Spek in a
        new tab you can close it.
      </p>
    </div>
  );
}
