import { useConsumerStore } from "../stores/useConsumerStore";
import { useVoiceStore } from "../stores/useVoiceStore";

export const consumeAudio = async (consumerParameters: any, peerId: string) => {
  const { recvTransport } = useVoiceStore.getState();

  if (!recvTransport) {
    console.log("skipping consumeAudio because recvTransport is null");
    return null;
  }

  const consumer = await recvTransport.consume({
    ...consumerParameters,
    appData: {
      peerId,
      produderId: consumerParameters.produderId,
      mediaTag: "cam-audio",
    },
  });

  useConsumerStore.getState().add(consumer, peerId);

  return true;
};
