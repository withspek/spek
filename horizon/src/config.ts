import {
  RtpCodecCapability,
  TransportListenInfo,
  WorkerLogTag,
} from "mediasoup/node/lib/types";

export const config = {
  mediasoup: {
    worker: {
      logLevel: "debug",
      logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"] as WorkerLogTag[],
    },

    router: {
      mediaCodecs: [
        {
          kind: "audio",
          mimeType: "audio/opus",
          clockRate: 48000,
          channels: 2,
        },
      ] as RtpCodecCapability[],
    },

    // rtp listenIps are the most important thing, below. you'll need
    // to set these appropriately for your network for the demo to
    // run anywhere but on localhost
    webRtcTransport: {
      listenInfos: [
        {
          ip: process.env.WEBRTC_LISTEN_IP || "0.0.0.0",
          announcedAddress: process.env.A_IP || undefined,
          portRange: {
            min: process.env.MEDIASOUP_MIN_PORT || 40000,
            max: process.env.MEDIASOUP_MAX_PORT || 49999,
          },
        },
      ] as TransportListenInfo[],
      initialAvailableOutgoingBitrate: 800000,
    },
  },
} as const;
