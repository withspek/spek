import { WSConnection } from "./raw";

export type Wrapper = ReturnType<typeof wrap>;

export const wrap = (connection: WSConnection) => ({
  connection,
  mutation: {
    speakingChange: (value: boolean) =>
      connection.send("speaking_change", { value }),
    setMute: (value: boolean) => connection.send("mute", { value }),
    setDeafen: (value: boolean) => connection.send("deafen", { value }),
  },
});
