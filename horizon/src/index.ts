import "dotenv/config";
import debugModule from "debug";
import { Router, Worker } from "mediasoup/node/lib/types";

import { Confs } from "./ConfState";
import { startMediasoup } from "./lib/startMediasoup";
import { startRabbitmq } from "./startRabbitmq";
import { createConsumer } from "./lib/createConsumer";
import { closePeer } from "./lib/closePeer";
import { deleteConf } from "./lib/deleteConf";
import { createTransport, transportToOptions } from "./lib/createTransport";

const log = debugModule("horizon:index");
const errLog = debugModule("horizon:ERROR");

const confs: Confs = {};

async function main() {
  // start mediasoup
  console.log("starting mediasoup");
  let workers: { worker: Worker; router: Router }[];

  try {
    workers = await startMediasoup();
  } catch (err) {
    console.log(err);
    throw err;
  }

  let workerIdx = 0;

  const getNextWorker = () => {
    const w = workers[workerIdx];
    workerIdx++;
    workerIdx %= workers.length;
    return w;
  };

  const createConf = () => {
    const { router, worker } = getNextWorker();

    return { worker, router, state: {} };
  };

  await startRabbitmq({
    "@get-recv-tracks": async (
      { confId, peerId: myPeerId, rtpCapabilities },
      uid,
      send,
      errBack
    ) => {
      if (!confs[confId]?.state[myPeerId]?.recvTransport) {
        errBack();
        return;
      }

      const { router, state } = confs[confId];
      const transport = state[myPeerId].recvTransport;

      if (!transport) {
        errBack();
        return;
      }

      const consumerParametersArr = [];

      for (const theirPeerId of Object.keys(state)) {
        const peerState = state[theirPeerId];

        if (theirPeerId === myPeerId || !peerState || !peerState.producer) {
          continue;
        }

        try {
          const { producer } = peerState;
          consumerParametersArr.push(
            await createConsumer(
              router,
              producer,
              rtpCapabilities,
              transport,
              myPeerId,
              state[theirPeerId]
            )
          );
        } catch (e) {
          errLog(e.message);
          continue;
        }
      }

      send({
        op: "@get-recv-tracks-done",
        uid,
        d: { consumerParametersArr, confId },
      });
    },
    "@send-track": async (
      {
        confId,
        appData,
        direction,
        kind,
        paused,
        peerId: myPeerId,
        rtpCapabilities,
        rtpParameters,
        transportId,
      },
      uid,
      send,
      errBack
    ) => {
      if (!(confId in confs)) {
        errBack();
        return;
      }
      const { state } = confs[confId];

      const {
        sendTransport,
        producer: previousProducer,
        consumers,
      } = state[myPeerId];
      const transport = sendTransport;

      if (!transport) {
        errBack();
        return;
      }

      try {
        if (previousProducer) {
          previousProducer.close();
          consumers.forEach((c) => c.close());
          // @todo give some time for frontends to get update, but this can be removed
          send({
            cid: confId,
            op: "close_consumer",
            d: { producerId: previousProducer.id, confId },
          });
        }

        const producer = await transport.produce({
          kind,
          rtpParameters,
          paused,
          appData: { ...appData, peerId: myPeerId, transportId },
        });

        confs[confId].state[myPeerId].producer = producer;

        for (const theirPeerId of Object.keys(state)) {
          if (theirPeerId === myPeerId) {
            continue;
          }
          const peerTransport = state[theirPeerId]?.recvTransport;

          if (!peerTransport) {
            continue;
          }

          try {
            const d = await createConsumer(
              confs[confId].router,
              producer,
              rtpCapabilities,
              peerTransport,
              myPeerId,
              state[theirPeerId]
            );
            send({
              uid: theirPeerId,
              op: "new-peer-speaker",
              d: { ...d, confId },
            });
          } catch (e) {
            errLog(e.message);
          }
        }
        send({
          op: `@send-track-${direction}-done`,
          uid,
          d: {
            id: producer.id,
            confId,
          },
        });
      } catch (e) {
        send({
          op: `@send-track-${direction}-done`,
          uid,
          d: {
            error: e.message,
            confId,
          },
        });
        send({
          op: `error`,
          uid,
          d: "error connecting to voice server | " + e.message,
        });

        return;
      }
    },
    "@connect-transport": async (
      { confId, direction, dtlsParameters, peerId },
      uid,
      send,
      errBack
    ) => {
      if (!confs[confId]?.state[peerId]) {
        errBack();
        return;
      }

      const { state } = confs[confId];

      const transport =
        direction === "recv"
          ? state[peerId].recvTransport
          : state[peerId].sendTransport;

      if (!transport) {
        errBack();
        return;
      }

      log("connect-transport", peerId, transport.appData);

      try {
        await transport.connect({ dtlsParameters });
      } catch (e) {
        console.log(e);
        send({
          op: `@connect-transport-${direction}-done` as const,
          uid,
          d: { error: e.message, confId },
        });
        send({
          op: "error",
          d: "error connecting to voice server | " + e.message,
          uid,
        });
        return;
      }

      send({
        op: `@connect-transport-${direction}-done` as const,
        uid,
        d: { confId },
      });
    },
    "close-peer": async ({ confId, peerId, kicked }, uid, send) => {
      if (confId in confs) {
        if (peerId in confs[confId].state) {
          closePeer(confs[confId].state[peerId]);
          delete confs[confId].state[peerId];
        }

        if (Object.keys(confs[confId].state).length == 0) {
          deleteConf(confId, confs);
        }
        send({ op: "you_left_conf", d: { confId, kicked: !!kicked }, uid });
      }
    },
    "create-conf": async ({ confId }, uid, send) => {
      if (!(confId in confs)) {
        confs[confId] = createConf();
      }
      send({ op: "conf-created", d: { confId }, uid });
    },
    "destroy-conf": async ({ confId }) => {
      if (confId in confs) {
        for (const peer of Object.values(confs[confId].state)) {
          closePeer(peer);
        }
        deleteConf(confId, confs);
      }
    },
    "remove-speaker": async ({ confId, peerId }) => {
      if (confId in confs) {
        const peer = confs[confId].state[peerId];
        peer?.producer?.close();
        peer?.sendTransport?.close();
      }
    },
    "join-as-speaker": async ({ confId, peerId }, uid, send) => {
      if (!(confId in confs)) {
        confs[confId] = createConf();
      }
      log("join-as-new-peer", peerId);

      const { state, router } = confs[confId];
      const [recvTransport, sendTransport] = await Promise.all([
        createTransport("recv", router, peerId),
        createTransport("send", router, peerId),
      ]);
      if (state[peerId]) {
        closePeer(state[peerId]);
      }
      confs[confId].state[peerId] = {
        recvTransport: recvTransport,
        sendTransport: sendTransport,
        consumers: [],
        producer: null,
      };

      send({
        op: "you-joined-as-speaker",
        d: {
          confId,
          peerId,
          routerRtpCapabilities: confs[confId].router.rtpCapabilities,
          recvTransportOptions: transportToOptions(recvTransport),
          sendTransportOptions: transportToOptions(sendTransport),
        },
        uid,
      });
    },
    "join-as-new-peer": async ({ confId, peerId }, uid, send) => {
      if (!(confId in confs)) {
        confs[confId] = createConf();
      }
      log("join-as-new-peer", peerId);
      const { state, router } = confs[confId];
      const recvTransport = await createTransport("recv", router, peerId);
      if (state[peerId]) {
        closePeer(state[peerId]);
      }

      confs[confId].state[peerId] = {
        recvTransport,
        consumers: [],
        producer: null,
        sendTransport: null,
      };

      send({
        op: "you-joined-as-peer",
        d: {
          confId,
          peerId,
          routerRtpCapabilities: confs[confId].router.rtpCapabilities,
          recvTransportOptions: transportToOptions(recvTransport),
        },
        uid,
      });
    },
    "add-speaker": async ({ confId, peerId }, uid, send, errBack) => {
      if (!confs[confId]?.state[peerId]) {
        errBack();
        return;
      }
      log("add-speaker", peerId);

      const { router } = confs[confId];
      const sendTransport = await createTransport("send", router, peerId);
      confs[confId].state[peerId].sendTransport?.close();
      confs[confId].state[peerId].sendTransport = sendTransport;

      send({
        op: "you-are-now-a-speaker",
        d: {
          sendTransportOptions: transportToOptions(sendTransport),
          confId,
        },
        uid,
      });
    },
  });
}

main();
