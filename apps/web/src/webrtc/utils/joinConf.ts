import { RtpCapabilities } from "mediasoup-client/lib/types";

import { useVoiceStore } from "../stores/useVoiceStore";

export const joinConf = async (routerRtpCapabilities: RtpCapabilities) => {
  const { device } = useVoiceStore.getState();

  if (!device?.loaded) {
    await device!.load({ routerRtpCapabilities });
  }
};
