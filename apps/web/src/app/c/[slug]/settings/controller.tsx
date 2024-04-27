"use client";

import { useRouter } from "next/navigation";

import { ChannelsList } from "@/components/community/ChannelsList";
import { Header } from "@/components/communitySettings/Header";
import { Overview } from "@/components/communitySettings/Overview";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import Tabs, { TabsContents, TabsTitles } from "@/ui/tabs";
import { MembersList } from "@/components/community/members-list";
import { Button } from "@/ui/button";

interface PageControllerProps {
  slug: string;
}

export const PageController: React.FC<PageControllerProps> = ({ slug }) => {
  const router = useRouter();
  const { data, isLoading } = useTypeSafeQuery(["getCommunity", slug], {}, [
    slug,
  ]);

  if (isLoading || !data) {
    return <div>loading...</div>;
  }

  if (!data.community.isAdmin) {
    router.replace("/home");
  }

  const subheading = {
    label: `Return to ${data.community.name}`,
    description: `Manage your community settings by changing name or description.
    You can manage members and channels in the community here`,
    to: `/c/${data.community.slug}`,
  };

  return (
    <div>
      <Header heading="Settings" subheading={subheading} avatar="" />
      <Tabs>
        <TabsTitles titles={["Overview", "Members", "Channels"]} />
        <TabsContents
          items={[
            {
              content: (
                <Overview
                  channels={data.channels}
                  community={data.community}
                  communitySlug={slug}
                />
              ),
            },
            {
              content: <MembersList communityId={data.community.id} />,
            },
            {
              content: (
                <>
                  <Button size="sm">Create</Button>
                  <ChannelsList
                    channels={data.channels}
                    community={data.community}
                    communitySlug={slug}
                  />
                </>
              ),
            },
          ]}
        />
      </Tabs>
    </div>
  );
};
