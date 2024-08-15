import { useRouter } from "next/navigation";

import WebSocketContext from "@/contexts/WebSocketContext";
import { useContext, useEffect, useRef } from "react";
import { useVoiceStore } from "./stores/useVoiceStore";
import { useMicIdStore } from "./stores/useMicIdStore";
import { useMuteStore } from "@/stores/useMuteStore";
import { useDeafStore } from "@/stores/useDeafStore";
import { useCurrentConfIdStore } from "@/stores/useCurentConfIdStore";
import { sendVoice } from "./utils/sendVoice";
import { consumeAudio } from "./utils/consumeAudio";
import { AudioRender } from "./components/AudioRender";
import { ActiveSpeakerListener } from "./components/ActiveSpeakerListener";
import { createTransport } from "./utils/createTransport";
import { joinConf } from "./utils/joinConf";
import { receiveVoice } from "./utils/receiveVoice";

export const WebRTC: React.FC = () => {
  const { conn } = useContext(WebSocketContext);
  const { mic } = useVoiceStore();
  const { micId } = useMicIdStore();
  const { muted } = useMuteStore();
  const { deafened } = useDeafStore();
  const { setCurrentConfId } = useCurrentConfIdStore();
  const initialLoad = useRef(true);
  const { push } = useRouter();

  useEffect(() => {
    if (micId && !initialLoad.current) {
      sendVoice();
    }
    initialLoad.current = false;
  }, [micId]);

  const consumerQueue = useRef<{ confId: string; d: any }[]>([]);

  function flushConsumerQueue(_confId: string) {
    try {
      for (const {
        confId,
        d: { peerId, consumerParameters },
      } of consumerQueue.current) {
        if (_confId === confId) {
          consumeAudio(consumerParameters, peerId);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      consumerQueue.current = [];
    }
  }

  useEffect(() => {
    if (mic) {
      mic.enabled = !muted && !deafened;
    }
  }, [mic, muted, deafened]);

  useEffect(() => {
    if (!conn) {
      return;
    }

    const unsubs = [
      conn.addListener<any>("you_left_conf", (d) => {
        if (d.kicked) {
          const { currentConfId } = useCurrentConfIdStore.getState();

          if (currentConfId !== d.confId) {
            return;
          }
          setCurrentConfId(null);
          closeVoiceConnections(d.confId);
          push("/home");
        }
      }),
      conn.addListener<any>("new-peer-speaker", async (d) => {
        const { confId, recvTransport } = useVoiceStore.getState();
        if (recvTransport && confId === d.confId) {
          await consumeAudio(d.consumerParameters, d.peerId);
        } else {
          consumerQueue.current = [...consumerQueue.current, { confId, d }];
        }
      }),
      conn.addListener<any>("you-are-now-a-speaker", async (d) => {
        if (d.confId !== useVoiceStore.getState().confId) {
          return;
        }
        try {
          await createTransport(conn, d.confId, "send", d.sendTransportOptions);
        } catch (err) {
          console.log(err);
          return;
        }
        console.log("sending voice");
        try {
          await sendVoice();
        } catch (err) {
          console.log(err);
        }
      }),
      conn.addListener<any>("you-joined-as-peer", async (d) => {
        closeVoiceConnections(null);
        useVoiceStore.getState().set({ confId: d.confId });
        consumerQueue.current = [];
        console.log("creating a device");
        try {
          await joinConf(d.routerRtpCapabilities);
        } catch (err) {
          console.log("error creating a device | ", err);
          return;
        }
        try {
          await createTransport(conn, d.confId, "recv", d.recvTransportOptions);
        } catch (err) {
          console.log("error creating recv transport | ", err);
          return;
        }
        receiveVoice(conn, () => flushConsumerQueue(d.confId));
      }),
      conn.addListener<any>("you-joined-as-speaker", async (d) => {
        closeVoiceConnections(null);
        useVoiceStore.getState().set({ confId: d.confId });
        // setStatus("connected-speaker");
        consumerQueue.current = [];
        console.log("creating a device");
        try {
          await joinConf(d.routerRtpCapabilities);
        } catch (err) {
          console.log("error creating a device | ", err);
          return;
        }
        try {
          await createTransport(conn, d.confId, "send", d.sendTransportOptions);
        } catch (err) {
          console.log("error creating send transport | ", err);
          return;
        }
        console.log("sending voice");
        try {
          await sendVoice();
        } catch (err) {
          console.log("error sending voice | ", err);
          return;
        }
        await createTransport(conn, d.confId, "recv", d.recvTransportOptions);
        receiveVoice(conn, () => flushConsumerQueue(d.confId));
      }),
    ];

    return () => {
      unsubs.forEach((x) => x());
    };
  }, [conn, push, setCurrentConfId]);

  return (
    <>
      <AudioRender />
      <ActiveSpeakerListener />
    </>
  );
};

export function closeVoiceConnections(_confId: string | null) {
  const { confId, mic, nullify } = useVoiceStore.getState();

  if (confId === null || _confId === confId) {
    if (mic) {
      console.log("stopping mic");
      mic.stop();
    }

    console.log("nulling transports");
    nullify();
  }
}
