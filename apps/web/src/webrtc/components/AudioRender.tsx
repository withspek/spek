import { Button } from "@spek/ui";
import { useEffect, useRef, useState } from "react";

import { useVolumeStore } from "@/stores/useVolumeStore";
import { useDeafStore } from "@/stores/useDeafStore";
import { useConsumerStore } from "../stores/useConsumerStore";

const MyAudio = ({
  volume,
  onRef,
  ...props
}: React.DetailedHTMLProps<
  React.AudioHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
> & { onRef: (a: HTMLAudioElement) => void; volume: number }) => {
  const myRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <audio
      ref={(r) => {
        if (r && !myRef.current) {
          (myRef as any).current = r;
          onRef(r);
        }
      }}
      {...props}
    />
  );
};

export const AudioRender: React.FC = () => {
  const notAllowedErrorCountRef = useRef(0);
  const [showAutoPlayModal, setShowAutoPlayModal] = useState(false);
  const { volume: globalVolume } = useVolumeStore();
  const { consumerMap, setAudioRef } = useConsumerStore();
  const audioRefs = useRef<[string, HTMLAudioElement][]>([]);
  const { deafened } = useDeafStore();

  return (
    <div
      className={`absolute top-0 w-full h-full flex z-50 bg-primary-900 ${showAutoPlayModal ? "" : "hidden"}`}
    >
      <div className="flex p-8 rounded m-auto bg-primary-700 flex-col">
        <div className="flex text-center mb-4 text-primary-100">
          Web browsers requires a user to interact with the page before playing
          audio. Just click okay to continue
        </div>
        <Button
          onClick={() => {
            setShowAutoPlayModal(false);
            audioRefs.current.forEach(([_, a]) => {
              a.play().catch((error) => {
                console.warn(error);
              });
            });
          }}
        >
          Okay
          {Object.keys(consumerMap).map((k) => {
            const { consumer, volume: userVolume } = consumerMap[k];
            return (
              <MyAudio
                volume={
                  deafened ? 0 : (userVolume / 200) * (globalVolume / 100)
                }
                // AutoPlay
                playsInline
                controls={false}
                key={consumer.id}
                onRef={(a) => {
                  setAudioRef(k, a);
                  audioRefs.current.push([k, a]);
                  a.srcObject = new MediaStream([consumer.track]);
                  //   prevent modal from showing up more than once in a single render cycle
                  const notAllowedErrorContent =
                    notAllowedErrorCountRef.current;
                  a.play().catch((err) => {
                    if (
                      err.name === "NotAllowedError" &&
                      notAllowedErrorCountRef.current === notAllowedErrorContent
                    ) {
                      notAllowedErrorCountRef.current++;
                      setShowAutoPlayModal(true);
                    }
                    console.log("audioElem.play failed: %o", err);
                  });
                }}
              />
            );
          })}
        </Button>
      </div>
    </div>
  );
};
