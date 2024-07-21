defmodule Telescope.Queries.Channels do
  import Ecto.Query

  alias Telescope.Schemas.ChannelMember
  alias Telescope.Schemas.Channel

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

  def membership_info(query, me_id) do
    query
    |> join(:left, [c], cm in ChannelMember,
      as: :member,
      on: cm.channelId == c.id and cm.userId == ^me_id
    )
    |> select_merge([c, member: cm], %{
      isMember: not is_nil(cm.id),
      isAdmin: not is_nil(c.creatorId) and c.creatorId == ^me_id
    })
  end
end
