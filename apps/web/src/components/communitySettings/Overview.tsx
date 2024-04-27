import React from "react";
import { useRouter } from "next/navigation";
import { Channel, CommunityWithPermissions } from "@spek/client";

import { EditForm } from "./EditForm";
import { Button } from "@/ui/button";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { confirmModal } from "../ConfirmModal";

interface OverviewProps {
  channels: Channel[];
  community: CommunityWithPermissions;
  communitySlug: string;
}

export const Overview: React.FC<OverviewProps> = ({ community }) => {
  const { push } = useRouter();
  const { mutateAsync: deleteCommunity, isLoading: deleteLoading } =
    useTypeSafeMutation("deleteCommunity");

  return (
    <div>
      <EditForm community={community} />
      <h3>Danger zone</h3>
      <Button
        color="primary"
        loading={deleteLoading}
        onClick={() => {
          confirmModal(
            "Are you sure you want to delete this community",
            async () => {
              await deleteCommunity([community.id]);
              push("/home");
            }
          );
        }}
      >
        Delete
      </Button>
    </div>
  );
};
