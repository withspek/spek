import { Consumer, Producer, Transport } from "mediasoup/node/lib/types";

export type Peer = {
  sendTransport: Transport | null;
  recvTransport: Transport | null;
  producer: Producer | null;
  consumers: Consumer[];
};
