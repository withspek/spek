import debugModule from "debug";
import { Router, WebRtcTransport } from "mediasoup/node/lib/types";

import { VoiceSendDirection } from "../types";
import { config } from "../config";

const log = debugModule("horizon:create-transport");

export const transportToOptions = ({
  id,
  iceParameters,
  iceCandidates,
  dtlsParameters,
}: WebRtcTransport) => ({ id, iceCandidates, iceParameters, dtlsParameters });

export type TransportOptions = ReturnType<typeof transportToOptions>;

export const createTransport = async (
  direction: VoiceSendDirection,
  router: Router,
  peerId: string
) => {
  log("create-transport", direction);

  const { listenInfos, initialAvailableOutgoingBitrate } =
    config.mediasoup.webRtcTransport;

  const transport = await router.createWebRtcTransport({
    listenInfos,
    enableTcp: true,
    enableUdp: true,
    preferUdp: true,
    initialAvailableOutgoingBitrate,
    appData: { peerId, clientDirection: direction },
  });

  return transport;
};
