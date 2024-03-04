import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="flex gap-16 sm:w-full md:w-md lg:w-lg xl:w-xl sm:px-3 lg:px-10 py-3">
      <Navbar />
      <div className="w-full h-full">
        <p>Home bar</p>
      </div>
    </main>
  );
}
