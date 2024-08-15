export type UUID = string;

export interface User {
  id: UUID;
  username: string;
  displayName: string;
  bio: string;
  email: string;
  bannerUrl: string;
  avatarUrl: string;
  githubUrl: string;
  online: boolean;
  lastOnline: string;
  gitlabUrl: string;
  current_conf: CurrentConf | null;
  current_conf_id: UUID | null;
  inserted_at: string;
  updated_at: string;
}

export type UserPreview = {
  id: UUID;
  displayName: string;
  username: string;
  avatarUrl: string;
  bio: string;
};

export interface Community {
  id: UUID;
  name: string;
  slug: string;
  description: string;
  memberCount: number;
  ownerId: string;
  inserted_at: string;
  updated_at: string;
}

export interface Channel {
  id: UUID;
  name: string;
  slug: string;
  description: string;
  isDefault: boolean;
  isPrivate: boolean;
  isMember: boolean;
  isAdmin: boolean;
  community: CommunityWithPermissions;
  memberCount: number;
  inserted_at: string;
  updated_at: string;
}

export type CommunityPermissions = {
  isAdmin: boolean;
  isMember: boolean;
  isBlocked: boolean;
  isMod: boolean;
};

export type CommunityWithPermissions = Community & CommunityPermissions;

export type Thread = {
  id: UUID;
  name: string;
  creator: User;
  communityId: string;
  youSubscribed: boolean;
  channelId: string;
  peoplePreviewList: UserPreview[];
  inserted_at: string;
};

export type TopThread = {
  id: UUID;
  name: string;
  message_count: number;
  peoplePreviewList: UserPreview[];
  community: { id: string; name: string };
};

export type Message = {
  id: UUID;
  text: string;
  user: User;
  threadId: string;
  inserted_at: string;
  updated_at: string;
};

export type UserDm = {
  id: UUID;
  peoplePreviewList: UserPreview[];
  inserted_at: string;
  updated_at: string;
};

export type LodgeMessage = {
  id: UUID;
  text: string;
  user: User;
  lodge_id: string;
  inserted_at: string;
  updated_at: string;
};

export type SearchReponse = {
  users: User[];
  threads: Thread[];
  communities: Community[];
  items: User[] & Thread[] & Community[];
};

export type Lodge = {
  id: UUID;
  type: number;
  message_count: number;
  member_count: number;
  recipients: UserPreview[];
  nsfw: boolean;
  user_limit: number;
  last_message_id: string;
  inserted_at?: string;
  updated_at?: string;
};

export type Conf = {
  id: UUID;
  name: string;
  description: string;
  creator_id: string;
  num_people_inside: number;
  people_preview_list: UserPreview[];
  is_private: boolean;
  inserted_at: string;
};

export type BooleanMap = Record<UUID, boolean>;

export type ConfPermissions = {
  asked_to_speak: boolean;
  is_speaker: boolean;
  is_mod: boolean;
};

export type ConfUser = User & {
  conf_permissions?: ConfPermissions | null;
};

export type CurrentConf = Conf & {
  users: ConfUser[];
  muteMap: BooleanMap;
  deafMap: BooleanMap;
  activeSpeakerMap: BooleanMap;
  autoSpeaker: boolean;
};
