"use client";

import { Device } from "mediasoup-client";
import { detectDevice, Transport } from "mediasoup-client/lib/types";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const getDevice = () => {
  try {
    let handlerName = detectDevice();
    if (!handlerName) {
      console.log(
        "mediasoup does not recognize this device, so it will be defaulted to Chrome74"
      );
      handlerName = "Chrome74";
    }

    return new Device({ handlerName });
  } catch {
    return null;
  }
};

export const useVoiceStore = create(
  combine(
    {
      confId: "",
      micStream: null as MediaStream | null,
      mic: null as MediaStreamTrack | null,
      recvTransport: null as Transport | null,
      sendTransport: null as Transport | null,
      device: getDevice(),
    },
    (set) => ({
      nullify: () =>
        set({
          recvTransport: null,
          sendTransport: null,
          confId: "",
          mic: null,
          micStream: null,
        }),
      set,
    })
  )
);
