"use client";

import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import Tabs, { TabsContents, TabsTitles } from "@/ui/tabs";
import { ThreadsFeed } from "@/components/community/threads-feed";
import { MembersList } from "@/components/community/members-list";
import { ActionButton } from "./action-button";
import { SettingsIcon } from "@/icons";
import { useRouter } from "next/navigation";
import { ChannelsList } from "@/components/community/ChannelsList";
import { CenterLoader } from "@/components/CenterLoader";

interface Props {
  slug: string;
}

export const CommunityPageController: React.FC<Props> = ({ slug }: Props) => {
  const router = useRouter();
  const { user } = useConn();
  const { data, isLoading } = useTypeSafeQuery(["getCommunity", slug], {}, [
    slug,
  ]);

  if (isLoading || !data) {
    return <CenterLoader />;
  }

  const channel = data.channels.find((c) => c.isDefault == true);

  return (
    <div className="mt-2">
      <div className="space-y-2 mb-3 px-3 rounded-lg py-2 transition-all cursor-pointer bg-gradient-to-tr from-primary-800 via-primary-600 to-primary-900">
        <div className="flex justify-between">
          <h1 className="text-xl">{data?.community.name}</h1>
          {data?.community.isAdmin && (
            <span
              className="cursor-pointer"
              onClick={() => router.push(`/c/${slug}/settings`)}
            >
              <SettingsIcon />
            </span>
          )}
        </div>
        <p>{data?.community.description}</p>
        <p>{data?.community.memberCount} members</p>
        <ActionButton currentUser={user} community={data?.community!} />
      </div>
      <div>
        <Tabs>
          <TabsTitles titles={["Threads", "Members", "Channels"]} />
          <TabsContents
            items={[
              {
                content: (
                  <ThreadsFeed
                    communityId={data?.community.id!}
                    isAdmin={data.community.isAdmin}
                    isMember={data.community.isMember}
                    currentUser={user}
                    channel={channel}
                  />
                ),
              },
              {
                content: <MembersList communityId={data?.community.id!} />,
              },
              {
                content: (
                  <ChannelsList
                    channels={data.channels}
                    communitySlug={slug}
                    community={data.community}
                  />
                ),
              },
            ]}
          />
        </Tabs>
      </div>
    </div>
  );
};
