import { Channel, Community, Conf, ConfUser } from "../entities";

export interface CreateCommunitiesResponse {
  channels: Channel;
  community: Community;
}

export interface GetTopCommunitiesResponse {
  communities: Community[];
}

export type CreateConfResponse =
  | {
      conf: Conf;
    }
  | { error: string };

export type JoinConfAndGetInfoResponse =
  | {
      conf: Conf;
      users: ConfUser[];
      muteMap: Record<string, boolean>;
      deafMap: Record<string, boolean>;
      activeSpeakerMap: Record<string, boolean>;
    }
  | { error: string };
