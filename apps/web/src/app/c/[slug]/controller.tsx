"use client";
import { useState } from "react";
import { Button } from "@spek/ui";
import { useRouter } from "next/navigation";

import { useConn } from "@/hooks/useConn";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import Tabs, { TabsContents, TabsTitles } from "@/ui/tabs";
import { ThreadsFeed } from "@/components/community/threads-feed";
import { MembersList } from "@/components/community/members-list";
import { ActionButton } from "./action-button";
import { SettingsIcon } from "@/icons";
import { ChannelsList } from "@/components/community/ChannelsList";
import { CenterLoader } from "@/components/CenterLoader";
import { CreateRoomModal } from "@/components/room/CreateRoomModal";
import { CreateInput } from "@/components/community/create-input";
import { RoomsFeed } from "@/components/community/rooms-feed";

interface Props {
  slug: string;
}

export const CommunityPageController: React.FC<Props> = ({ slug }: Props) => {
  const router = useRouter();
  const { user } = useConn();
  const [createRoomModal, setCreateRoomModal] = useState(false);
  const { data, isLoading } = useTypeSafeQuery(["getCommunity", slug], {}, [
    slug,
  ]);

  const handleCreateRoomModal = () => {
    setCreateRoomModal(!createRoomModal);
  };

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
          <TabsTitles titles={["Threads", "Rooms", "Channels", "Members"]} />
          <TabsContents
            items={[
              {
                content: (
                  <div className="flex flex-col gap-4 mt-2">
                    {user && data.community.isMember ? (
                      <div className="flex gap-3">
                        <CreateInput
                          channelId={channel?.id!}
                          communityId={data.community.id}
                        />
                      </div>
                    ) : null}
                    <ThreadsFeed channelId={channel?.id!} />
                  </div>
                ),
              },
              {
                content: (
                  <>
                    {user && data.community.isMember ? (
                      <Button type="button" onClick={handleCreateRoomModal}>
                        New room
                      </Button>
                    ) : null}
                    <RoomsFeed communityId={data.community.id} />
                    {createRoomModal && (
                      <CreateRoomModal
                        onOpenChange={handleCreateRoomModal}
                        open={createRoomModal}
                        communityId={data.community.id}
                      />
                    )}
                  </>
                ),
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
              {
                content: <MembersList communityId={data?.community.id!} />,
              },
            ]}
          />
        </Tabs>
      </div>
    </div>
  );
};
