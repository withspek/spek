import React from "react";
import { Conf, ConfUser } from "@spek/client";

import { useSplitUsersIntoSections } from "./useSplitUsersIntoSections";
import { Badge } from "@spek/ui";

interface Props {
  conf: Conf;
  users: ConfUser[];
  activeSpeakerMap: Record<string, boolean>;
  muteMap: Record<string, boolean>;
  deafMap: Record<string, boolean>;
}
export const RoomUsersPanel: React.FC<Props> = (props) => {
  const { askingToSpeak, listeners, speakers } =
    useSplitUsersIntoSections(props);

  return (
    <div className={`flex pt-4 px-4 flex-1`}>
      <div className="w-full block">
        <div className={`w-full grid grid-cols-5 gap-5`}>
          {speakers}
          {askingToSpeak.length ? (
            <div className="flex gap-2 col-span-full h-4">
              <p>Asking to speak</p>
              <Badge>{askingToSpeak.length}</Badge>
            </div>
          ) : null}
          {askingToSpeak}
          {listeners.length ? (
            <div className="flex gap-2 col-span-full h-4">
              <p>Listeners</p>
              <Badge>{listeners.length}</Badge>
            </div>
          ) : null}
          {listeners}
          <div className={`flex h-3 w-full col-span-full`}></div>
        </div>
      </div>
    </div>
  );
};
