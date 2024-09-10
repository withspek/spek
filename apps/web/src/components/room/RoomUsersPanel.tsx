import React from "react"
import { Conf, ConfUser } from "@spek/client"

import { useSplitUsersIntoSections } from "./useSplitUsersIntoSections"
import { RoomSectionHeader } from "./RoomSectionHeader"

interface Props {
  conf: Conf
  users: ConfUser[]
  activeSpeakerMap: Record<string, boolean>
  muteMap: Record<string, boolean>
  deafMap: Record<string, boolean>
}
export const RoomUsersPanel: React.FC<Props> = (props) => {
  const { askingToSpeak, listeners, speakers } =
    useSplitUsersIntoSections(props)

  return (
    <div className={`flex p-2 flex-1 overflow-y-auto bg-primary-800`}>
      <div className="w-full block">
        <div className={`w-full grid grid-cols-5 gap-5`}>
          {speakers}
          {askingToSpeak.length ? (
            <RoomSectionHeader
              count={askingToSpeak.length}
              title="Requesting to speak"
            />
          ) : null}
          {askingToSpeak}
          {listeners.length ? (
            <RoomSectionHeader count={listeners.length} title="Listeners" />
          ) : null}
          {listeners}
          <div className={`flex h-3 w-full col-span-full`}></div>
        </div>
      </div>
    </div>
  )
}
