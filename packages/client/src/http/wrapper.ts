import { Community, User } from "../entities";
import { Connection } from "./raw";
import { GetTopCommunitiesResponse } from "./responses";

export const wrap = (connection: Connection) => ({
  query: {
    getUsers: (): Promise<User[]> => connection.send("/dev", "GET"),
    getTopCommunities: (): Promise<GetTopCommunitiesResponse> =>
      connection.send("/community/all", "GET"),
  },
  mutation: {
    createCommunity: (data: {
      name: string;
      description: string;
    }): Promise<Community> =>
      connection.send("/community/create", "POST", { ...data }),
  },
});
