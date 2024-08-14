import {
  Channel,
  Community,
  CommunityPermissions,
  CommunityWithPermissions,
  LodgeMessage,
  Lodge,
  Message,
  SearchReponse,
  Thread,
  TopThread,
  User,
  Conf,
} from "../entities";
import { Connection } from "./raw";
import {
  CreateConfRespone,
  GetTopCommunitiesResponse,
  JoinConfAndGetInfoResponse,
} from "./responses";

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
    getTopActiveThreads: (
      cursor: number
    ): Promise<{ threads: TopThread[]; nextCursor: number | null }> =>
      connection.send(`/api/v1/threads?cursor=${cursor}`, "GET"),
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
    joinThreadAndGetInfo: (threadId: string): Promise<Thread> =>
      connection.send("/api/v1/threads/join-info", "POST", { threadId }),
    search: (query: string): Promise<SearchReponse> =>
      connection.send(`/misc/search?query=${query}`, "GET"),
    getUserLodges: (): Promise<Lodge[]> =>
      connection.send(`/api/v1/users/@me/lodges`, "GET"),
    getUserCommunities: (
      cursor: number
    ): Promise<{ communities: Community[]; nextCursor: number }> =>
      connection.send(`/api/v1/users/@me/communities?cursor=${cursor}`, "GET"),
    getLodgeMembers: (lodgeId: string): Promise<Lodge[]> =>
      connection.send(`/api/v1/lodges/${lodgeId}/members`, "GET"),
    joinLodgeAndGetInfo: (lodgeId: string): Promise<Lodge> =>
      connection.send(`/api/v1/lodges/${lodgeId}/join-info`, "GET"),
    getLodgeMessages: (
      lodgeId: string,
      cursor: number = 0
    ): Promise<{
      messages: LodgeMessage[];
      nextCursor: number | null;
      initial: boolean;
    }> =>
      connection.send(
        `/api/v1/lodges/${lodgeId}/messages?cursor=${cursor}`,
        "GET"
      ),

    getTopPublicConfs: (
      communityId: string,
      cursor: number = 0
    ): Promise<{
      confs: Conf[];
      nextCursor: number | null;
    }> =>
      connection.send(`/api/v1/confs/${communityId}?cursor=${cursor}`, "GET"),
    joinConfAndGetInfo: (confId: string): Promise<JoinConfAndGetInfoResponse> =>
      connection.send(`/api/v1/confs/${confId}/join_and_get_info`, "POST"),
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
    createLodge: (userIds: string[]): Promise<{ lodge: Lodge }> =>
      connection.send(`/api/v1/lodges/create`, "POST", { users: userIds }),

    deleteLodge: (lodgeId: string): Promise<{ success: boolean }> =>
      connection.send(`/api/v1/lodges/${lodgeId}`, "DELETE"),
    addLodgeRecipient: (
      lodgeId: string,
      userId: string
    ): Promise<{ success: boolean }> =>
      connection.send(`/api/v1/lodges/${lodgeId}/add-recipient`, "POST", {
        userId,
      }),
    removeLodgeRecipient: (
      lodgeId: string,
      userId: string
    ): Promise<{ success: boolean }> =>
      connection.send(`/api/v1/lodges/${lodgeId}/remove-recipient`, "POST", {
        userId,
      }),

    createLodgeMessage: (data: {
      lodgeId: string;
      text: string;
    }): Promise<LodgeMessage> =>
      connection.send(`/api/v1/lodges/${data.lodgeId}/send-message`, "POST", {
        ...data,
      }),

    leaveLodge: (
      lodgeId: string,
      userId: string
    ): Promise<{ success: boolean }> =>
      connection.send(`/api/v1/lodges/${lodgeId}/leave`, "POST", {
        userId,
      }),

    createConf: (data: {
      name: string;
      description: string;
      communityId: string;
    }): Promise<CreateConfRespone> =>
      connection.send(`/api/v1/confs/create`, "POST", { ...data }),
  },
});
