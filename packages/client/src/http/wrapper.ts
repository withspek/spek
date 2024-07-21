import {
  Channel,
  Community,
  CommunityPermissions,
  CommunityWithPermissions,
  DmMessage,
  Message,
  SearchReponse,
  Thread,
  TopThread,
  User,
  UserDm,
} from "../entities";
import { Connection } from "./raw";
import { GetTopCommunitiesResponse } from "./responses";

export const wrap = (connection: Connection) => ({
  query: {
    getUsers: (): Promise<User[]> => connection.send("/dev", "GET"),
    getAllUsers: (): Promise<User[]> =>
      connection.send("/api/v1/metrics/users", "GET"),
    getAllCommnunities: (): Promise<Community[]> =>
      connection.send("/api/v1/metrics/communities", "GET"),
    getCommunity: (
      slug: string
    ): Promise<{ community: CommunityWithPermissions; channels: Channel[] }> =>
      connection.send(`/api/v1/communities/${slug}`, "GET"),
    getChannel: (id: string): Promise<{ channel: Channel }> =>
      connection.send(`/api/v1/channels/${id}`, "GET"),
    getTopCommunities: (): Promise<GetTopCommunitiesResponse> =>
      connection.send("/api/v1/communities/all", "GET"),
    getCommunityMembers: (id: string): Promise<User[]> =>
      connection.send(`/api/v1/communities/${id}/members`, "GET"),
    getChannelMembers: (id: string): Promise<User[]> =>
      connection.send(`/channels/${id}/members`, "GET"),
    getCommunityPermissions: (id: string): Promise<CommunityPermissions> =>
      connection.send(`/api/v1/communities/${id}/permissions`, "GET"),
    getChannelThreads: (channelId: string): Promise<Thread[]> =>
      connection.send(`/api/v1/threads/all/${channelId}`, "GET"),
    getThread: (threadId: string): Promise<Thread> =>
      connection.send(`/api/v1/threads/${threadId}`, "GET"),
    getTopActiveThreads: (): Promise<TopThread[]> =>
      connection.send(`/api/v1/threads`, "GET"),
    getDm: (dmId: string): Promise<UserDm> =>
      connection.send(`/api/v1/dms/${dmId}`, "GET"),
    getThreadMessages: (
      threadId: string,
      cursor: number = 0
    ): Promise<{ messages: Message[]; nextCursor: number | null }> =>
      connection.send(
        `/api/v1/threads/${threadId}/messages?cursor=${cursor}`,
        "GET"
      ),
    getUserProfile: (userId: string): Promise<{ user: User }> =>
      connection.send(`/api/v1/users/${userId}`, "GET"),
    getUserDms: (): Promise<UserDm[]> => connection.send(`/api/v1/dms`, "GET"),
    getDmMessages: (
      dmId: string,
      cursor: number = 0
    ): Promise<{
      messages: DmMessage[];
      nextCursor: number | null;
      initial: boolean;
    }> =>
      connection.send(`/api/v1/dms/${dmId}/messages?cursor=${cursor}`, "GET"),
    joinDmAndGetInfo: (dmId: string): Promise<UserDm> =>
      connection.send("/api/v1/dms/join-info", "POST", { dmId }),
    joinThreadAndGetInfo: (threadId: string): Promise<Thread> =>
      connection.send("/api/v1/threads/join-info", "POST", { threadId }),
    search: (query: string): Promise<SearchReponse> =>
      connection.send(`/misc/search?query=${query}`, "GET"),
  },
  mutation: {
    updateProfile: (data: {
      username: string;
      displayName: string;
      bio: string;
    }): Promise<any> => connection.send(`/api/v1/users`, "PUT", { ...data }),
    createCommunity: (data: {
      name: string;
      description: string;
    }): Promise<{ community: Community; error?: string }> =>
      connection.send("/api/v1/communities/create", "POST", { ...data }),
    joinCommunity: (data: {
      communityId: string;
      userId: string;
    }): Promise<any> =>
      connection.send("/api/v1/communities/join", "POST", { ...data }),
    leaveCommunity: (data: {
      communityId: string;
      userId: string;
    }): Promise<any> =>
      connection.send("/api/v1/communities/leave", "POST", { ...data }),
    deleteCommunity: (communityId: string): Promise<any> =>
      connection.send(`/api/v1/communities/${communityId}`, "DELETE"),
    updateCommunity: (data: {
      communityId: string;
      name: string;
      description: string;
    }): Promise<{ community: CommunityWithPermissions; error?: string }> =>
      connection.send(`/api/v1/communities/${data.communityId}`, "PUT", {
        ...data,
      }),
    createChannel: (data: {
      communityId: string;
      name: string;
      description: string;
    }): Promise<{ channel: Channel; error?: string }> =>
      connection.send("/api/v1/channels/create", "POST", { ...data }),
    joinChannel: (channelId: string): Promise<any> =>
      connection.send("/api/v1/channels/join", "POST", { channelId }),
    leaveChannel: (channelId: string): Promise<{ success: boolean }> =>
      connection.send("/api/v1/channels/leave", "POST", { channelId }),
    deleteChannel: (channelId: string): Promise<{ success: boolean }> =>
      connection.send(`/api/v1/channels/${channelId}`, "DELETE"),
    updateChannel: (data: {
      channelId: string;
      name: string;
      description: string;
    }): Promise<{ channel: Channel }> =>
      connection.send(`/api/v1/channels/${data.channelId}`, "PUT", { ...data }),
    createThread: (data: {
      name: string;
      channelId: string;
      communityId: string;
    }): Promise<Thread> =>
      connection.send(`/api/v1/threads/create`, "POST", { ...data }),
    createDM: (userIds: string[]): Promise<UserDm> =>
      connection.send(`/api/v1/dms/create`, "POST", { userIds }),
    createDirectMessage: (data: {
      dmId: string;
      text: string;
    }): Promise<DmMessage> =>
      connection.send(`/api/v1/dms/${data.dmId}/send-message`, "POST", {
        ...data,
      }),
    createThreadMessage: (data: {
      communityId: string;
      threadId: string;
      userId: string;
      text: string;
    }): Promise<Message> =>
      connection.send(`/api/v1/threads/${data.threadId}/send-message`, "POST", {
        ...data,
      }),

    subscribeToThread: (threadId: string): Promise<{ success: boolean }> =>
      connection.send(`/api/v1/threads/subscribe`, "POST", { threadId }),
    unsubscribeToThread: (threadId: string): Promise<{ success: boolean }> =>
      connection.send(`/api/v1/threads/unsubscribe`, "POST", { threadId }),
  },
});
