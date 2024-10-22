defmodule Telescope.Access.Channels do
  import Ecto.Query, warn: false

  alias Telescope.Repo
  alias Telescope.Schemas.Message
  alias Telescope.Schemas.Community
  alias Telescope.Schemas.Channel
  alias Telescope.Schemas.Subscriber
  alias Telescope.Schemas.User
  alias Telescope.Schemas.ChannelMember
  alias Telescope.Schemas.Thread
  alias Telescope.Queries.Channels, as: Query

  def get_channel_by_id(id, me_id) do
    Query.start()
    |> Query.filter_by_id(id)
    |> Query.membership_info(me_id)
    |> Query.limit_one()
    |> Repo.one()
    |> Repo.preload([:community])
  end

  def get_channels_by_community_id(id, me_id) do
    Query.start()
    |> Query.filter_by_community_id(id)
    |> Query.membership_info(me_id)
    |> Repo.all()
    |> Repo.preload([:community])
  end

  def get_channel_members(channelId) do
    query =
      from(c in ChannelMember,
        join: u in User,
        on: u.id == c.userId,
        select: %User.Preview{
          online: u.online,
          lastOnline: u.lastOnline,
          avatarUrl: u.avatarUrl,
          displayName: u.displayName,
          id: u.id,
          bio: u.bio
        },
        where: c.channelId == ^channelId
      )

    Repo.all(query, [])
  end

  ####################### THREADS ###################

  def get_top_active_threads() do
    # select * from threads as t left join messages as m on t.id=m.threadId left join channels as c on c.id=t.channelId order by d.
    threads =
      from(t in Thread,
        left_join: c in Channel,
        on: c.id == t.channelId,
        left_join: co in Community,
        on: co.id == t.communityId,
        join: u in User,
        on: u.id == t.creatorId,
        left_join: m in Message,
        on: m.threadId == t.id,
        order_by: m.inserted_at,
        select: %Thread.Preview{
          id: t.id,
          name: t.name,
          channel: %Channel.Preview{id: c.id, name: c.name},
          peoplePreviewList: t.peoplePreviewList,
          community: %Community.Preview{
            id: co.id,
            name: co.name,
            description: co.description,
            slug: co.slug
          },
          creator: %User.Preview{
            id: u.id,
            avatarUrl: u.avatarUrl,
            bio: u.bio,
            displayName: u.displayName
          }
        }
      )
      |> Repo.all()

    threads
  end

  def get_threads_by_channel_id(id) do
    from(th in Thread, where: th.channelId == ^id, order_by: [desc: th.inserted_at])
    |> Repo.all()
    |> Repo.preload(:creator)
  end

  def get_thread_by_id(id, user_id) do
    from(th in Thread)
    |> where([th], th.id == ^id)
    |> select([th], th)
    |> join(:left, [th], sub in Subscriber,
      as: :sub,
      on: sub.threadId == th.id and sub.subscriberId == ^user_id
    )
    |> join(:inner, [th], u in User, as: :creator, on: th.creatorId == u.id)
    |> select_merge([sub: sub, creator: c], %{
      you_subscribed: not is_nil(sub.subscriberId),
      creator: c
    })
    |> limit([th], 1)
    |> Repo.one()
  end

  def search_thread_name(start_of_name) do
    search_str = start_of_name <> "%"

    from(th in Thread)
    |> where([th], ilike(th.name, ^search_str))
    |> limit([], 15)
    |> Repo.all()
  end
end
