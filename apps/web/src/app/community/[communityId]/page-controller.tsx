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
  const { data: community, isLoading } = useTypeSafeQuery(
    ["getCommunity", id],
    {},
    [id]
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="w-md">
      <div className="bg-alabaster-500 mb-3 px-3">
        <h1 className="text-xl">{community?.name}</h1>
        <p>{community?.description}</p>
        <p>{community?.memberCount}</p>
      </div>
      <JoinButton communityId={id} />
      <div>
        <Tabs>
          <Tabs.Titles titles={["Threads", "Members"]} />
          <Tabs.Contents
            items={[
              {
                content: (
                  <ThreadsFeed
                    communityId={id}
                    isAdmin={true}
                    isMember={true}
                    currentUser={user}
                  />
                ),
              },
              {
                content: <MembersList communityId={id} />,
              },
            ]}
          />
        </Tabs>
      </div>
    </div>
  );
};
