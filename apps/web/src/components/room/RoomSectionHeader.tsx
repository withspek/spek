import { Badge } from "@spek/ui"
import React from "react"

interface Props {
  title: string
  count: number
}

export const RoomSectionHeader: React.FC<Props> = ({ count, title }) => {
  return (
    <div className="flex items-center px-4 gap-2 col-span-full h-4">
      <p>{title}</p>
      <Badge>{count}</Badge>
    </div>
  )
}
