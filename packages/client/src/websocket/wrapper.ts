import { WSConnection } from "./raw";

export type Wrapper = ReturnType<typeof wrap>;

export const wrap = (connection: WSConnection) => ({
  connection,
});
