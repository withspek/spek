import { Community, User } from "../entities";
import { Connection } from "./raw";

export const wrap = (connection: Connection) => ({
  query: {
    getUsers: (): Promise<User[]> => connection.send("/dev", "GET"),
  },
  mutation: {
    createCommunity: (data: {
      name: string;
      description: string;
    }): Promise<Community> =>
      connection.send("/community/create", "POST", { ...data }),
  },
});
