"use client";

import { Button } from "@spek/ui";
import Link from "next/link";
import { useState } from "react";

import { CreateChannelModal } from "@/components/communitySettings/CreateChannelModal";
import { Header } from "@/components/communitySettings/Header";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

interface PageProps {
  slug: string;
}

const Page: React.FC<PageProps> = ({ slug }) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getCommunity", slug],
    { enabled: false },
    [slug]
  );

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.channels.map((channel) => (
        <div
          key={channel.id}
          className="rounded-md border border-primary-700 px-4 py-1"
        >
          <Link href={`/c/${slug}/${channel.id}`} className="font-semibold">
            {channel.name}
          </Link>
          <p className="text-primary-300">{channel.description}</p>
        </div>
      ))}
    </div>
  );
};

export const ChannelsSettingsController: React.FC<{ slug: string }> = ({
  slug,
}) => {
  const { data } = useTypeSafeQuery(
    ["getCommunity", slug],
    { enabled: false },
    [slug]
  );

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="flex flex-col gap-4">
      <Header heading="Channels" communitySlug={slug} />
      <div>
        <Button onClick={handleOpenModal}>Create channel</Button>
      </div>
      <Page slug={slug} />
      <CreateChannelModal
        communityId={data?.community.id}
        onRequestClose={handleOpenModal}
        open={openModal}
      />
    </div>
  );
};
