import { Channel, Community, Conf, User } from "../entities";

export interface CreateCommunitiesResponse {
  channels: Channel;
  community: Community;
}

export interface GetTopCommunitiesResponse {
  communities: Community[];
}

export type CreateConfRespone =
  | {
      conf: Conf;
    }
  | { error: string };

export type JoinConfAndGetInfoResponse =
  | {
      conf: Conf;
      users: User[];
      autoSpeaker: boolean;
      activeSpeakerMap: string[];
      deafMap: string[];
      muteMap: string;
    }
  | { error: string };
