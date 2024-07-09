import React from "react";
import { useRouter } from "next/navigation";
import { Channel, CommunityWithPermissions } from "@spek/client";

import { EditForm } from "./EditForm";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { confirmModal } from "../ConfirmModal";
import { Button } from "@spek/ui";

interface OverviewProps {
  channels: Channel[];
  community: CommunityWithPermissions;
  communitySlug: string;
}

interface DangerZoneItemProps {
  title: string;
  actionTitle: string;
  onActionClick: () => void;
  loading?: boolean;
  subtitle: string;
}

const DangerZoneItem: React.FC<DangerZoneItemProps> = ({
  onActionClick,
  subtitle,
  title,
  actionTitle,
  loading,
}) => {
  return (
    <div className="flex gap-2 justify-between">
      <div>
        <p>{title}</p>
        <p className="text-sm text-primary-400">{subtitle}</p>
      </div>
      <Button
        disabled={loading}
        type="button"
        color="minimal"
        onClick={onActionClick}
      >
        {actionTitle}
      </Button>
    </div>
  );
};

export const Overview: React.FC<OverviewProps> = ({ community }) => {
  const { push } = useRouter();
  const { mutateAsync: deleteCommunity, isLoading: deleteLoading } =
    useTypeSafeMutation("deleteCommunity");

  return (
    <div>
      <EditForm community={community} />
      <h2 className="mt-4">Danger zone</h2>
      <div className="flex flex-col gap-3 border border-red-800 px-4 py-5 rounded-md mt-4">
        <DangerZoneItem
          actionTitle="Delete"
          loading={deleteLoading}
          onActionClick={() => {
            confirmModal(
              `Are you sure you want to delete ${community.name}`,
              async () => {
                const resp = await deleteCommunity([community.id]);
                if (resp.success) {
                  push(`/c/${community.slug}`);
                }
              }
            );
          }}
          subtitle="Once you delete a community, there is no going back. Please be certain."
          title="Delete community"
        />
      </div>
    </div>
  );
};
