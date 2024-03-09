export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  email: string;
  bannerUrl: string;
  avatarUrl: string;
  githubUrl: string;
  gitlabUrl: string;
  inserted_at: string;
  updated_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  ownerId: string;
  inserted_at: string;
  updated_at: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  communityId: string;
  memberCount: number;
  inserted_at: string;
  updated_at: string;
}
