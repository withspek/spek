import { useRouter } from "next/navigation";
import { Channel, CommunityWithPermissions } from "@spek/client";
import { SettingsIcon } from "@/icons";

interface ChannelsListProps {
  community: CommunityWithPermissions;
  channels: Channel[];
  communitySlug: string;
}
export const ChannelsList: React.FC<ChannelsListProps> = ({
  community,
  channels,
}) => {
  const { push } = useRouter();
  const sortChannels = (array: Array<Channel>): Array<Channel> => {
    if (!array || array.length === 0) return [];

    const generalChannel = array.find((channel) => channel.slug === "general");
    const withoutGeneral = array.filter(
      (channel) => channel.slug !== "general"
    );
    const sortedWithoutGeneral = withoutGeneral.sort((a, b) => {
      if (a.slug < b.slug) return -1;
      if (a.slug > b.slug) return 1;
      return 0;
    });
    if (generalChannel) {
      sortedWithoutGeneral.unshift(generalChannel);
      return sortedWithoutGeneral;
    } else {
      return sortedWithoutGeneral;
    }
  };

  const sortedChannels = sortChannels(channels);

  return (
    <div className="flex flex-col gap-3">
      {sortedChannels.map((channel) => (
        <div
          key={channel.id}
          className="flex justify-between items-center cursor-pointer"
        >
          <p
            onClick={() => push(`/c/${community.slug}/${channel.id}`)}
            className="text-lg"
          >
            #{channel.name}
          </p>
          <div className="flex items-center gap-3">
            {!channel.isMember ? (
              <button className="bg-alabaster-700 px-3 py-1 rounded-md">
                Join
              </button>
            ) : !channel.isAdmin ? (
              <button type="button">Leave</button>
            ) : null}
            {channel.isAdmin && (
              <button
                onClick={() =>
                  push(`/c/${community.slug}/${channel.id}/settings`)
                }
              >
                <SettingsIcon />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
