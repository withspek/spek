defmodule Operations.Queries.Channels do
  alias Models.ChannelMember
  alias Models.Channel
  import Ecto.Query

  def start() do
    from(c in Channel)
  end

  def start_member() do
    from(cm in ChannelMember)
  end

  def filter_by_member(query, channel_id, user_id) do
    where(query, [cm], cm.channelId == ^channel_id and cm.userId == ^user_id)
  end

  def limit_one(query) do
    limit(query, [], 1)
  end

  def filter_by_id(query, id) do
    where(query, [c], c.id == ^id)
  end

  def filter_by_community_id(query, id) do
    where(query, [c], c.communityId == ^id)
  end

  def inc_member_count(query, n) do
    update(query,
      inc: [
        memberCount: ^n
      ]
    )
  end
end
