import { User } from "../entities";
import { Connection } from "./wrapper";

export const wrap = (connection: Connection) => ({
  query: {
    getUsers: (): Promise<User[]> => connection.send("/dev", "GET"),
  },
  mutation: {},
});
