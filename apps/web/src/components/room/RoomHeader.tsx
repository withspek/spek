import { ConfUser } from "@spek/client"
import React from "react"

interface Props {
  name: string
  description: string
  numPeopleInside: number
  roomCreator?: ConfUser
}

export const RoomHeader: React.FC<Props> = ({
  name,
  roomCreator,
  numPeopleInside,
}) => {
  return (
    <div className="flex sticky top-0 flex-col p-2  mt-2 gap-2 bg-primary-900 rounded-t-md">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-xl truncate">{name}</p>
        <p className="pr-4">{numPeopleInside}</p>
      </div>
      <p className="text-primary-500">
        with <span className="text-primary-100">{roomCreator?.username}</span>
      </p>
    </div>
  )
}
