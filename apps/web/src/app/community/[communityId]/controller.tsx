"use client";

import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import Tabs from "@/ui/tabs";
import { ThreadsFeed } from "@/components/community/threads-feed";
import { MembersList } from "@/components/community/members-list";
import { ActionButton } from "./action-button";

interface Props {
  id: string;
}

export const CommunityPageController: React.FC<Props> = ({ id }: Props) => {
  const { user } = useConn();
  const { data, isLoading } = useTypeSafeQuery(["getCommunity", id], {}, [id]);

  if (isLoading) {
    return <div>loading...</div>;
  }

  const channel = data?.channels.find((c) => c.isDefault == true);

  return (
    <div className="mt-2">
      <div className="bg-alabaster-500 mb-3 px-3 rounded-lg py-2">
        <h1 className="text-xl">{data?.community.name}</h1>
        <p>{data?.community.description}</p>
        <p>{data?.community.memberCount} members</p>
      </div>
      <ActionButton currentUser={user} community={data?.community!} />
      <div>
        <Tabs>
          <Tabs.Titles titles={["Threads", "Members", "Channels"]} />
          <Tabs.Contents
            items={[
              {
                content: (
                  <ThreadsFeed
                    communityId={id}
                    isAdmin={true}
                    isMember={true}
                    currentUser={user}
                    channel={channel}
                  />
                ),
              },
              {
                content: <MembersList communityId={id} />,
              },
              {
                content: (
                  <>
                    {data?.channels.map((c) => (
                      <div key={c.id}>
                        <p>ID: {c.id}</p>
                        <p>Name: {c.name}</p>
                      </div>
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
