import { Channel, Community, Conf } from "../entities";

export interface CreateCommunitiesResponse {
  channels: Channel;
  community: Community;
}

export interface GetTopCommunitiesResponse {
  communities: Community[];
}

export interface CreateConfRespone {
  conf?: Conf;
  error?: string;
}
