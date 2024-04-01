import {
  Channel,
  Community,
  CommunityPermissions,
  DmMessage,
  Message,
  Thread,
  User,
  UserDm,
} from "../entities";
import { Connection } from "./raw";
import { GetTopCommunitiesResponse } from "./responses";

export const wrap = (connection: Connection) => ({
  query: {
    getUsers: (): Promise<User[]> => connection.send("/dev", "GET"),
    getCommunity: (
      id: string
    ): Promise<{ community: Community; channels: Channel[] }> =>
      connection.send(`/community/${id}`, "GET"),
    getTopCommunities: (): Promise<GetTopCommunitiesResponse> =>
      connection.send("/community/all", "GET"),
    getCommunityMembers: (id: string): Promise<User[]> =>
      connection.send(`/community/${id}/members`, "GET"),
    getCommunityPermissions: (id: string): Promise<CommunityPermissions> =>
      connection.send(`/community/${id}/permissions`, "GET"),
    getChannelThreads: (channelId: string): Promise<Thread[]> =>
      connection.send(`/threads/all/${channelId}`, "GET"),
    getThread: (threadId: string): Promise<Thread> =>
      connection.send(`/threads/${threadId}`, "GET"),
    getDm: (dmId: string): Promise<UserDm> =>
      connection.send(`/dms/${dmId}`, "GET"),
    getThreadMessages: (threadId: string): Promise<Message[]> =>
      connection.send(`/threads/${threadId}/messages`, "GET"),
    getUserProfile: (userId: string): Promise<{ user: User }> =>
      connection.send(`/user/${userId}`, "GET"),
    getUserDms: (): Promise<UserDm[]> => connection.send(`/dms`, "GET"),
    getDmMessages: (dmId: string): Promise<{ messages: DmMessage[] }> =>
      connection.send(`/dms/${dmId}/messages`, "GET"),
    joinDmAndGetInfo: (dmId: string): Promise<UserDm> =>
      connection.send("/dms/join-info", "POST", { dmId }),
  },
  mutation: {
    updateProfile: (data: {
      username: string;
      displayName: string;
      bio: string;
    }): Promise<any> => connection.send(`/user/update`, "PUT", { ...data }),
    createCommunity: (data: {
      name: string;
      description: string;
    }): Promise<Community> =>
      connection.send("/community/create", "POST", { ...data }),
    joinCommunity: (data: {
      communityId: string;
      userId: string;
    }): Promise<any> => connection.send("/community/join", "POST", { ...data }),
    createThread: (data: {
      name: string;
      channelId: string;
      communityId: string;
    }): Promise<Thread> =>
      connection.send(`/threads/create`, "POST", { ...data }),
    createDM: (userIds: string[]): Promise<UserDm> =>
      connection.send(`/dms/create`, "POST", { userIds }),

    createDirectMessage: (data: {
      dmId: string;
      text: string;
    }): Promise<DmMessage> =>
      connection.send(`/dms/${data.dmId}/message`, "POST", { ...data }),
    createThreadMessage: (data: {
      communityId: string;
      threadId: string;
      userId: string;
      text: string;
    }): Promise<Message> =>
      connection.send(`/threads/${data.threadId}/message`, "POST", { ...data }),
  },
});
