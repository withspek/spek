import React from "react";
import { Conf, ConfUser } from "@spek/client";

import { useSplitUsersIntoSections } from "./useSplitUsersIntoSections";

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
    <div>
      {speakers.length ? <p>Speakers</p> : null}
      {speakers}
      {askingToSpeak}
      {listeners.length ? <p>Listeners</p> : null}
      {listeners}
    </div>
  );
};
