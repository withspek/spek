import { websocket } from "@spek/client";
import { useContext, useEffect } from "react";
import hark from "hark";

import WebSocketContext from "@/contexts/WebSocketContext";
import { useVoiceStore } from "../stores/useVoiceStore";
import { useCurrentConfIdStore } from "@/stores/useCurentConfIdStore";

interface ActiveSpeakerListenerProps {}

export const ActiveSpeakerListener: React.FC<
  ActiveSpeakerListenerProps
> = ({}) => {
  const { conn } = useContext(WebSocketContext);
  const { micStream } = useVoiceStore();
  const { currentConfId } = useCurrentConfIdStore();

  useEffect(() => {
    if (!currentConfId || !micStream || !conn) {
      return;
    }

    const wrappedConn = websocket.wrap(conn);

    const harker = hark(micStream, { threshold: -65, interval: 75 });

    harker.on("speaking", () => {
      wrappedConn.mutation.speakingChange(true);
    });

    harker.on("stopped_speaking", () => {
      wrappedConn.mutation.speakingChange(false);
    });

    return () => {
      harker.stop();
    };
  }, [micStream, currentConfId, conn]);

  return null;
};
