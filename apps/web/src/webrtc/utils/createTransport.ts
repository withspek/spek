import { websocket } from "@spek/client";
import { TransportOptions } from "mediasoup-client/lib/types";

import { useVoiceStore } from "../stores/useVoiceStore";

export async function createTransport(
  conn: websocket.WSConnection,
  _confId: string,
  direction: "recv" | "send",
  transportOptions: TransportOptions
) {
  console.log(`create ${direction} transport`);
  const { device, set } = useVoiceStore.getState();

  // ask the server to create a server-side transport object and send
  // us back the info we need to create a client-side transport
  console.log("transport options", transportOptions);
  const transport =
    direction === "recv"
      ? await device!.createRecvTransport(transportOptions)
      : await device!.createSendTransport(transportOptions);

  // mediasoup-client will emit a connect event when media needs to
  // start flowing for the first time. send dtlsParameters to the
  // server, then call callback() on success or errback() on failure.
  transport.on("connect", ({ dtlsParameters }, callback, errback) => {
    conn.once<any>(
      `@connect-transport-${direction}-done`,
      (d: { error: string | null }) => {
        if (d.error) {
          console.log(`connect-transport ${direction} failed`, d.error);
          if (d.error.includes("already called")) {
            callback();
          } else {
            errback(new Error("There was an error"));
          }
        } else {
          console.log(`connect-transport ${direction} success`);
          callback();
        }
      }
    );

    conn.send("@connect-transport", {
      transportId: transportOptions.id,
      dtlsParameters,
      direction,
    });
  });

  if (direction === "send") {
    // sending transports will emit a produce event when a new track
    // needs to be set up to start sending. the producer's appData is
    // passed as a parameter
    transport.on(
      "produce",
      ({ kind, rtpParameters, appData }, callback, errback) => {
        console.log("transport produce event", appData.mediaTag);

        // tell the server what it needs to know from us in order to set
        // up a server-side producer object, and get back a
        // producer.id. call callback() on success or errback() on
        // failure.
        conn.once<any>(
          `@send-track-${direction}-done`,
          (d: { error: string | null; id: string }) => {
            if (d.error) {
              console.log(`send-track ${direction} failed`, d.error);
              errback(new Error("sending track failed"));
            } else {
              console.log(`send-track-transport ${direction} success`);
              callback({ id: d.id });
            }
          }
        );

        conn.send("@send-track", {
          transportId: transportOptions.id,
          kind,
          rtpParameters,
          rtpCapabilities: device!.rtpCapabilities,
          paused: false,
          appData,
          direction,
        });
      }
    );
  }

  // any time a transport transitions to closed,
  // failed, or disconnected, leave the room and reset
  transport.on("connectionstatechange", (state) => {
    console.log(
      `${direction} transport ${transport.id} connectionstatechange ${state}`
    );
  });

  if (direction === "recv") {
    set({ recvTransport: transport });
  } else {
    set({ sendTransport: transport });
  }
}
