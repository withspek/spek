import { Router, Worker } from "mediasoup/node/lib/types";
import { Peer } from "./Peer";

export type Then<T> = T extends PromiseLike<infer U> ? U : T;

export type ConfState = Record<string, Peer>;

export type Confs = Record<
  string,
  { worker: Worker; router: Router; state: ConfState }
>;
