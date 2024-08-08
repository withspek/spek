import amqp, { Connection } from "amqplib";
import {
  DtlsParameters,
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup/node/lib/types";

import { VoiceSendDirection } from "./types";
import { Consumer } from "./lib/createConsumer";
import { TransportOptions } from "./lib/createTransport";

const retryInterval = 5000;

export interface HandlerDataMap {
  "create-conf": {
    confId: string;
  };
  "add-speaker": {
    confId: string;
    peerId: string;
  };
  "join-as-speaker": {
    confId: string;
    peerId: string;
  };
  "join-as-new-peer": {
    confId: string;
    peerId: string;
  };
  "@get-recv-tracks": {
    confId: string;
    peerId: string;
    rtpCapabilities: RtpCapabilities;
  };
  "remove-speaker": { confId: string; peerId: string };
  "destroy-conf": { confId: string };
  "close-peer": { confId: string; peerId: string; kicked?: boolean };
  "@send-track": {
    confId: string;
    peerId: string;
    transportId: string;
    direction: VoiceSendDirection;
    paused: boolean;
    kind: MediaKind;
    rtpParameters: RtpParameters;
    appData: any;
    rtpCapabilities: RtpCapabilities;
  };
  "@connect-transport": {
    confId: string;
    dtlsParameters: DtlsParameters;
    peerId: string;
    direction: VoiceSendDirection;
  };
}

export type HandlerMap = {
  [Key in keyof HandlerDataMap]: (
    d: HandlerDataMap[Key],
    uid: string,
    send: <Key extends keyof OutgoingMessageDataMap>(
      obj: OutgoingMessage<Key>
    ) => void,
    errBack: () => void
  ) => void;
};

type OutgoingMessageDataMap = {
  "you-joined-as-speaker": {
    confId: string;
    peerId: string;
    routerRtpCapabilities: RtpCapabilities;
    recvTransportOptions: TransportOptions;
    sendTransportOptions: TransportOptions;
  };
  error: string;
  "conf-created": {
    confId: string;
  };
  "@get-recv-tracks-done": {
    consumerParametersArr: Consumer[];
    confId: string;
  };
  close_consumer: {
    producerId: string;
    confId: string;
  };
  "new-peer-speaker": {
    confId: string;
  } & Consumer;
  you_left_conf: {
    confId: string;
    kicked: boolean;
  };
  "you-are-now-a-speaker": {
    sendTransportOptions: TransportOptions;
    confId: string;
  };
  "you-joined-as-peer": {
    confId: string;
    peerId: string;
    routerRtpCapabilities: RtpCapabilities;
    recvTransportOptions: TransportOptions;
  };
} & {
  [Key in SendTrackDoneOperationName]: {
    error?: string;
    id?: string;
    confId: string;
  };
} & {
  [Key in ConnectTransportDoneOperationName]: {
    error?: string;
    confId: string;
  };
};

type SendTrackDoneOperationName = `@send-track-${VoiceSendDirection}-done`;
type ConnectTransportDoneOperationName =
  `@connect-transport-${VoiceSendDirection}-done`;

type OutgoingMessage<Key extends keyof OutgoingMessageDataMap> = {
  op: Key;
  d: OutgoingMessageDataMap[Key];
} & ({ uid: string } | { cid: string });

interface IncomingChannelMessageData<Key extends keyof HandlerMap> {
  op: Key;
  d: HandlerDataMap[Key];
  uid: string;
}

export let send = <Key extends keyof OutgoingMessageDataMap>(
  _obj: OutgoingMessage<Key>
) => {};

export const startRabbitmq = async (handler: HandlerMap) => {
  console.log(
    "trying to connect to: ",
    process.env.RABBITMQ_URL || "amqp://localhost"
  );
  let conn: Connection;

  try {
    conn = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
  } catch (err) {
    console.error("Unable to connect to RabbitMQ: ", err);
    setTimeout(async () => await startRabbitmq(handler), retryInterval);
    return;
  }

  const id = process.env.QUEUE_ID || "";
  console.log("rabbitmq connected " + id);
  conn.on("close", async function (err: Error) {
    console.log("RabbitMQ Connection closed with error: ", err);
    setTimeout(async () => await startRabbitmq(handler), retryInterval);
  });

  const channel = await conn.createChannel();
  const sendQueue = "spek_queue" + id;
  const onlineQueue = "spek_online_queue" + id;
  const receiveQueue = "horizon_queue" + id;
  console.log(sendQueue, onlineQueue, receiveQueue);
  await Promise.all([
    channel.assertQueue(receiveQueue),
    channel.assertQueue(sendQueue),
    channel.assertQueue(onlineQueue),
  ]);

  send = <Key extends keyof OutgoingMessageDataMap>(
    obj: OutgoingMessage<Key>
  ) => {
    channel.sendToQueue(sendQueue, Buffer.from(JSON.stringify(obj)));
  };

  await channel.purgeQueue(receiveQueue);

  await channel.consume(
    receiveQueue,
    async (e) => {
      const m = e?.content.toString();

      if (m) {
        let data: IncomingChannelMessageData<any> | undefined;
        try {
          data = JSON.parse(m);
        } catch {}

        if (data && data.op && data.op in handler) {
          const { d: HandlerData, op: operation, uid } = data;

          try {
            console.log(operation);
            await handler[operation as keyof HandlerMap](
              HandlerData,
              uid,
              send,
              () => {
                console.log(operation);
                send({
                  op: "error",
                  d: "The voiec server is probably redeploying, it should reconnect in a few seconds. If not, try refreshing.",
                  uid: uid,
                });
              }
            );
          } catch (error) {
            // TODO: Sentry as a Logging servie
            console.log(operation, error);
          }
        }
      }
    },
    { noAck: true }
  );
  channel.sendToQueue(
    onlineQueue,
    Buffer.from(JSON.stringify({ op: "online" }))
  );
};
