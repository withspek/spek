import { useMicPermErrorStore } from "@/stores/useMicPermErrorStore";
import { useMicIdStore } from "../stores/useMicIdStore";
import { useVoiceStore } from "../stores/useVoiceStore";
import { useProducerStore } from "../stores/useProducerStore";

export const sendVoice = async () => {
  const { micId } = useMicIdStore.getState();
  const { sendTransport, set, mic } = useVoiceStore.getState();

  if (!sendTransport) {
    console.log("no sendTransport in sendVoice");
    return null;
  }

  mic?.stop();
  let micStream: MediaStream;

  try {
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: micId ? { deviceId: micId } : true,
    });
    useMicPermErrorStore.getState().set({ error: false });
  } catch (error) {
    set({ mic: null, micStream: null });
    console.log(error);
    useMicPermErrorStore.getState().set({ error: true });
    return;
  }

  const audioTracks = micStream.getAudioTracks();

  if (audioTracks.length) {
    console.log("creating producer...");
    const track = audioTracks[0];
    useProducerStore.getState().add(
      await sendTransport.produce({
        track,
        appData: { mediaTag: "cam-audio" },
      })
    );

    set({ mic: track, micStream });
    return;
  }

  set({ mic: null, micStream: null });
};
