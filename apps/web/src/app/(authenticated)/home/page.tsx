import { Metadata } from "next";
import { HomeController } from "./controller";
import { MainLayout } from "@spek/ui";
import { LeftPanel } from "@/components/Panels";
import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <WaitForWsAndAuth>
      <MainLayout leftPanel={<LeftPanel />}>
        <div className="flex flex-col gap-2 px-3 pt-4 w-full">
          <HomeController />
        </div>
      </MainLayout>
    </WaitForWsAndAuth>
  );
}
