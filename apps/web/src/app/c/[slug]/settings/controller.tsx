"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ChannelsList } from "@/components/community/ChannelsList";
import { Header } from "@/components/communitySettings/Header";
import { Overview } from "@/components/communitySettings/Overview";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import Tabs, { TabsContents, TabsTitles } from "@/ui/tabs";
import { MembersList } from "@/components/community/members-list";
import { Button } from "@/ui/button";
import { CreateChannelModal } from "@/components/communitySettings/CreateChannelModal";

interface PageControllerProps {
  slug: string;
}

export const PageController: React.FC<PageControllerProps> = ({ slug }) => {
  const [open, setOpen] = useState(false);
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
                  <Button size="sm" onClick={() => setOpen(!open)}>
                    Create
                  </Button>
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
      {open ? (
        <CreateChannelModal
          communityId={data.community.id}
          open={open}
          onRequestClose={() => setOpen(!open)}
        />
      ) : null}
    </div>
  );
};
