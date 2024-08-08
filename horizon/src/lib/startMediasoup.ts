import * as mediasoup from "mediasoup";
import { Router, Worker } from "mediasoup/node/lib/types";
import os from "os";
import { config } from "../config";

export async function startMediasoup() {
  const workers: Array<{ worker: Worker; router: Router }> = [];

  for (let i = 0; i < Object.keys(os.cpus()).length; i++) {
    let worker = await mediasoup.createWorker({
      logLevel: config.mediasoup.worker.logLevel,
      logTags: config.mediasoup.worker.logTags,
    });

    worker.on("died", () => {
      console.log("mediasoup worker died (this should never happen)");
      process.exit(1);
    });

    const mediaCodecs = config.mediasoup.router.mediaCodecs;
    const router = await worker.createRouter({ mediaCodecs });

    workers.push({ worker, router });
  }
  return workers;
}
