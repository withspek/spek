import {
  Channel,
  Community,
  CommunityPermissions,
  CommunityWithPermissions,
  DmMessage,
  Message,
  SearchReponse,
  Thread,
  User,
  UserDm,
} from "../entities";
import { Connection } from "./raw";
import { GetTopCommunitiesResponse } from "./responses";

export const wrap = (connection: Connection) => ({
  query: {
    getUsers: (): Promise<User[]> => connection.send("/dev", "GET"),
    getAllUsers: (): Promise<User[]> => connection.send("/admin/users", "GET"),
    getAllCommnunities: (): Promise<Community[]> =>
      connection.send("/admin/communities", "GET"),
    getCommunity: (
      slug: string
    ): Promise<{ community: CommunityWithPermissions; channels: Channel[] }> =>
      connection.send(`/community/${slug}`, "GET"),
    getChannel: (id: string): Promise<{ channel: Channel }> =>
      connection.send(`/channels/${id}`, "GET"),
    getTopCommunities: (): Promise<GetTopCommunitiesResponse> =>
      connection.send("/community/all", "GET"),
    getCommunityMembers: (id: string): Promise<User[]> =>
      connection.send(`/community/${id}/members`, "GET"),
    getChannelMembers: (id: string): Promise<User[]> =>
      connection.send(`/channels/${id}/members`, "GET"),
    getCommunityPermissions: (id: string): Promise<CommunityPermissions> =>
      connection.send(`/community/${id}/permissions`, "GET"),
    getChannelThreads: (channelId: string): Promise<Thread[]> =>
      connection.send(`/threads/all/${channelId}`, "GET"),
    getThread: (threadId: string): Promise<Thread> =>
      connection.send(`/threads/${threadId}`, "GET"),
    getDm: (dmId: string): Promise<UserDm> =>
      connection.send(`/dms/${dmId}`, "GET"),
    getThreadMessages: (
      threadId: string,
      cursor: number = 0
    ): Promise<{ messages: Message[]; nextCursor: number | null }> =>
      connection.send(`/threads/${threadId}/messages?cursor=${cursor}`, "GET"),
    getUserProfile: (userId: string): Promise<{ user: User }> =>
      connection.send(`/user/${userId}`, "GET"),
    getUserDms: (): Promise<UserDm[]> => connection.send(`/dms`, "GET"),
    getDmMessages: (
      dmId: string,
      cursor: number = 0
    ): Promise<{
      messages: DmMessage[];
      nextCursor: number | null;
      initial: boolean;
    }> => connection.send(`/dms/${dmId}/messages?cursor=${cursor}`, "GET"),
    joinDmAndGetInfo: (dmId: string): Promise<UserDm> =>
      connection.send("/dms/join-info", "POST", { dmId }),
    joinThreadAndGetInfo: (threadId: string): Promise<Thread> =>
      connection.send("/threads/join-info", "POST", { threadId }),
    search: (query: string): Promise<SearchReponse> =>
      connection.send(`/misc/search?query=${query}`, "GET"),
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
    }): Promise<{ community: Community; error?: string }> =>
      connection.send("/community/create", "POST", { ...data }),
    joinCommunity: (data: {
      communityId: string;
      userId: string;
    }): Promise<any> => connection.send("/community/join", "POST", { ...data }),
    leaveCommunity: (data: {
      communityId: string;
      userId: string;
    }): Promise<any> =>
      connection.send("/community/leave", "POST", { ...data }),
    deleteCommunity: (communityId: string): Promise<any> =>
      connection.send(`/community/${communityId}`, "DELETE"),
    updateCommunity: (data: {
      communityId: string;
      name: string;
      description: string;
    }): Promise<{ community: CommunityWithPermissions; error?: string }> =>
      connection.send(`/community/${data.communityId}`, "PUT", { ...data }),
    createChannel: (data: {
      communityId: string;
      name: string;
      description: string;
    }): Promise<{ channel: Channel; error?: string }> =>
      connection.send("/channels/create", "POST", { ...data }),
    joinChannel: (channelId: string): Promise<any> =>
      connection.send("/channels/join", "POST", { channelId }),
    leaveChannel: (channelId: string): Promise<{ success: boolean }> =>
      connection.send("/channels/leave", "POST", { channelId }),
    deleteChannel: (channelId: string): Promise<{ success: boolean }> =>
      connection.send("/channels/delete", "DELETE", { channelId }),
    updateChannel: (data: {
      channelId: string;
      name: string;
      description: string;
    }): Promise<{ channel: Channel }> =>
      connection.send(`/channels/${data.channelId}`, "PUT", { ...data }),
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

    subscribeToThread: (threadId: string): Promise<{ success: boolean }> =>
      connection.send(`/threads/subscribe`, "POST", { threadId }),
    unsubscribeToThread: (threadId: string): Promise<{ success: boolean }> =>
      connection.send(`/threads/unsubscribe`, "POST", { threadId }),
  },
});
