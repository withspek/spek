import { Metadata } from "next";
import { HomeController } from "./controller";
import { Button, Icon, MainLayout, ThreadCard } from "@spek/ui";
import { LeftPanel } from "@/components/Panels";
import { Input } from "@/ui/input";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <MainLayout leftPanel={<LeftPanel />}>
      <div className="flex flex-col gap-2 px-3 pt-4">
        <div className="flex gap-3">
          <Input placeholder="Search " />
          <Button>
            <Icon name="plus" />
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-primary-200 h-20 px-3 py-2 rounded-md">
            <p>Hello</p>
          </div>
          <div className="border border-primary-300 h-20 px-3 py-2 rounded-md">
            <p>Hello</p>
          </div>
          <ThreadCard
            avatars={[{ image: "/ciduc", title: "" }]}
            conversation={{
              channelName: "General",
              communityName: "Spek support",
              description: "Hello world this is the description for the clubs",
              messageCount: 12,
              name: "This is where we talk about bugs and features requests",
            }}
          />
        </div>
      </div>
      <HomeController />
    </MainLayout>
  );
}
