"use client";
import { useRouter } from "next/navigation";

import { useConn } from "@/hooks/useConn";
import { MinimizedRoomCard } from "./MinimizedRoomCard";
import { useMuteStore } from "@/stores/useMuteStore";
import { useDeafStore } from "@/stores/useDeafStore";
import { useSetMute } from "@/hooks/useSetMute";
import { useSetDeafen } from "@/hooks/useSetDeafen";
import { useLeaveConf } from "@/hooks/useLeaveConf";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";

interface Props {
  confId: string;
}

export const MinimizedRoomCardController: React.FC<Props> = ({ confId }) => {
  const { user } = useConn();
  const { muted } = useMuteStore();
  const { deafened } = useDeafStore();
  const setMute = useSetMute();
  const setDeafen = useSetDeafen();
  const { isLoading, leaveConf } = useLeaveConf();
  const { push } = useRouter();
  const { isLoading: joinLoading, data } = useTypeSafeQuery(
    ["joinConfAndGetInfo", confId],
    {},
    [confId]
  );

  if (joinLoading || !data) {
    return null;
  }

  if ("error" in data) {
    return <div>{data.error}</div>;
  }

  return (
    <>
      {user ? (
        <div className="w-full">
          <MinimizedRoomCard
            onFullScreenClick={() => push(`/conf/${data.conf.id}`)}
            leaveLoading={isLoading}
            room={{
              me: {
                isDeafened: deafened,
                isMuted: muted,
                leave: () => leaveConf(),
                isSpeaker: true,
                switchDeafened: () => setDeafen(!deafened),
                switchMuted: () => setMute(!muted),
              },
              name: data?.conf.name,
              descriptioin: data?.conf.description,
            }}
          />
        </div>
      ) : null}
    </>
  );
};
