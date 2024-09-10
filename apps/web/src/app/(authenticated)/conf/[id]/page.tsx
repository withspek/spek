import React from "react"
import { MainLayout } from "@spek/ui"
import { Metadata } from "next"

import { WaitForWsAndAuth } from "@/components/auth/WaitForWsAndAuth"
import { LeftPanel } from "@/components/Panels"
import { ConfController } from "./controller"
import { defaultQueryFn } from "@/utils/defaultQueryFn"
import { Conf } from "@spek/client"
import { WEBAPP_URL } from "@spek/lib/constants"

interface Props {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id

  const { conf }: { conf: Conf | null } = await defaultQueryFn({
    queryKey: `api/public/confs/${id}`,
  })

  return conf
    ? {
        title: conf.name,
        openGraph: {
          title: conf.name,
          type: "music.radio_station",
          url: `${WEBAPP_URL}/conf/${conf.id}`,
        },
        twitter: {
          card: "summary_large_image",
          title: conf.name,
        },
      }
    : { title: "Room" }
}
export default function ConfPage({ params }: Props) {
  return (
    <WaitForWsAndAuth>
      <MainLayout leftPanel={<LeftPanel />}>
        <ConfController id={params.id} />
      </MainLayout>
    </WaitForWsAndAuth>
  )
}
