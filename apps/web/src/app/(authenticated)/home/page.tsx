import { Metadata } from "next";
import { HomeController } from "./controller";
import { MainLayout } from "@spek/ui";
import { LeftPanel } from "@/components/Panels";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <MainLayout leftPanel={<LeftPanel />}>
      <div className="flex flex-col gap-2 px-3 pt-4 w-full">
        <HomeController />
      </div>
    </MainLayout>
  );
}
