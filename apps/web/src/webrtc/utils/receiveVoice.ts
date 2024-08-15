import { UUID, websocket } from "@spek/client";
import { ConsumerOptions } from "mediasoup-client/lib/types";

import { consumeAudio } from "./consumeAudio";
import { useVoiceStore } from "../stores/useVoiceStore";

export type ConfPeer = {
  peerId: UUID;
  consumerParameters: ConsumerOptions;
};

export const receiveVoice = (
  conn: websocket.WSConnection,
  flushQueue: () => void
) => {
  conn.once(
    "@get-recv-tracks-done",
    (params: { consumerParametersArr: ConfPeer[] }) => {
      try {
        for (const {
          peerId,
          consumerParameters,
        } of params.consumerParametersArr) {
          consumeAudio(consumerParameters, peerId);
        }
      } catch (error) {
        console.log(error);
      } finally {
        flushQueue();
      }
    }
  );
  conn.send("@get-recv-tracks", {
    rtpCapabilities: useVoiceStore.getState().device!.rtpCapabilities,
  });
};
