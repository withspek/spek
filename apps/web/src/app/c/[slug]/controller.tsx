"use client";

import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import Tabs, { TabsContents, TabsTitles } from "@/ui/tabs";
import { ThreadsFeed } from "@/components/community/threads-feed";
import { MembersList } from "@/components/community/members-list";
import { ActionButton } from "./action-button";
import Link from "next/link";
import { SettingsIcon } from "@/icons";
import { useRouter } from "next/navigation";

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
    return <div>loading...</div>;
  }

  const channel = data.channels.find((c) => c.isDefault == true);

  return (
    <div className="mt-2">
      <div className="bg-alabaster-500 mb-3 px-3 rounded-lg py-2">
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
      </div>
      <ActionButton currentUser={user} community={data?.community!} />
      <div>
        <Tabs>
          <TabsTitles titles={["Threads", "Members", "Channels"]} />
          <TabsContents
            items={[
              {
                content: (
                  <ThreadsFeed
                    communityId={data?.community.id!}
                    isAdmin={true}
                    isMember={true}
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
                  <>
                    {data?.channels.map((channel) => (
                      <Link
                        href={`/c/${data.community.slug!}/${channel.id}`}
                        key={channel.id}
                      >
                        <p>ID: {channel.id}</p>
                        <p>Name: {channel.name}</p>
                      </Link>
                    ))}
                  </>
                ),
              },
            ]}
          />
        </Tabs>
      </div>
    </div>
  );
};
