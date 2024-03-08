import { Channel, Community } from "../entities";

export interface CreateCommunitiesResponse {
  channels: Channel;
  community: Community;
}

export interface GetTopCommunitiesResponse {
  communities: Community[];
}
