import React from "react";
import { Channel, CommunityWithPermissions } from "@spek/client";
import Tabs, { TabsContents, TabsTitles } from "@/ui/tabs";
import { EditForm } from "./EditForm";
import { Button } from "@/ui/button";

interface OverviewProps {
  channels: Channel[];
  community: CommunityWithPermissions;
  communitySlug: string;
}

export const Overview: React.FC<OverviewProps> = ({
  channels,
  community,
  communitySlug,
}) => {
  return (
    <div>
      <Tabs>
        <TabsTitles titles={["Overview", "Members", "Channels"]} />
        <TabsContents
          items={[
            {
              content: (
                <>
                  <EditForm community={community} />
                  <h3>Danger zone</h3>
                  <Button color="primary">Delete</Button>
                </>
              ),
            },
          ]}
        />
      </Tabs>
    </div>
  );
};
