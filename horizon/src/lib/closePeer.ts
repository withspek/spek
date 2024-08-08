import { Peer } from "../Peer";

export const closePeer = (state: Peer) => {
  state.producer?.close();
  state.recvTransport?.close();
  state.sendTransport?.close();
  state.consumers.forEach((c) => c.close());
};
