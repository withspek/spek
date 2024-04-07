defmodule Operations.Access.Channels do
  import Ecto.Query, warn: false

  alias Models.Subscriber
  alias Models.User
  alias Models.User
  alias Models.ChannelMember
  alias Models.Thread
  alias Operations.Queries.Channels, as: Query
  alias Spek.Repo

  def get_channel_by_id(id) do
    Query.start()
    |> Query.filter_by_id(id)
    |> Query.limit_one()
    |> Repo.all()
  end

  def get_channels_by_community_id(id) do
    Query.start()
    |> Query.filter_by_community_id(id)
    |> Repo.all()
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
    |> select_merge([sub: sub], %{
      youSubscribed: not is_nil(sub.subscriberId)
    })
    |> limit([th], 1)
    |> Repo.one()
    |> Repo.preload(:creator)
  end

  def search_thread_name(start_of_name) do
    search_str = start_of_name <> "%"

    from(th in Thread)
    |> where([th], ilike(th.name, ^search_str))
    |> limit([], 15)
    |> Repo.all()
  end
end
