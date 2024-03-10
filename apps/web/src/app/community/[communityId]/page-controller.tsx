"use client";

import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { JoinButton } from "./join-button";
import Tabs from "@/ui/tabs";
import { ThreadsFeed } from "@/components/community/threads-feed";
import { MembersList } from "@/components/community/members-list";

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
    <div className="w-md">
      <div className="bg-alabaster-500 mb-3 px-3">
        <h1 className="text-xl">{data?.community.name}</h1>
        <p>{data?.community.description}</p>
        <p>{data?.community.memberCount}</p>
      </div>
      <JoinButton communityId={id} />
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
