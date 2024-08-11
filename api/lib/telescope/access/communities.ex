defmodule Telescope.Access.Communities do
  @fetch_limit 21

  import Ecto.Query

  alias Telescope.Repo
  alias Telescope.Schemas.Message
  alias Telescope.Schemas.Channel
  alias Telescope.Schemas.Thread
  alias Telescope.Schemas.CommunityPermissions
  alias Telescope.Schemas.CommunityMember
  alias Telescope.Schemas.Community
  alias Telescope.Schemas.User
  alias Telescope.Queries.Communities, as: Query

  def all_communities do
    query = from(c in Community, order_by: c.memberCount)
    Repo.all(query)
  end

  def all_threads_ids() do
    from(t in Thread, select: t.id)
    |> Repo.all()
  end

  def get_top_communities(limit) do
    query =
      from(c in Community,
        limit: ^limit,
        order_by: c.memberCount
      )

    Repo.all(query)
  end

  def get_user_joined_communities(offset \\ 20, user_id) do
    communities =
      from(c in Community,
        offset: ^offset,
        limit: ^@fetch_limit,
        join: cm in CommunityMember,
        on: cm.communityId == c.id and cm.userId == ^user_id,
        order_by: c.memberCount
      )
      |> Repo.all([])

    {Enum.slice(communities, 0, -1 + @fetch_limit),
     if(length(communities) == @fetch_limit, do: -1 + offset + @fetch_limit, else: nil)}
  end

  def get_top_threads_with_message_counts(offset \\ 20) do
    threads =
      from(t in Thread, offset: ^offset, limit: ^@fetch_limit)
      |> join(:left, [t], m in Message, on: m.threadId == t.id)
      |> join(:inner, [t], c in Community, on: c.id == t.communityId)
      |> group_by([t, _m, c], [t.id, c.id])
      |> select([t, _m, c], %Thread.Preview{
        id: t.id,
        name: t.name,
        community: c,
        peoplePreviewList: t.peoplePreviewList
      })
      |> select_merge([t, m], %{
        message_count: count(m.id)
      })
      |> order_by([_t, m], desc: count(m.id))
      |> Repo.all()

    {Enum.slice(threads, 0, -1 + @fetch_limit),
     if(length(threads) == @fetch_limit, do: -1 + offset + @fetch_limit, else: nil)}
  end

  def get_community_by_id(id, user_id) do
    Query.start()
    |> Query.filter_by_id(id)
    |> select([c], c)
    |> Query.perms_them_info(user_id)
    |> Query.limit_one()
    |> Repo.one()
  end

  def get_community_by_slug(slug, user_id) do
    Query.start()
    |> Query.filter_by_slug(slug)
    |> select([c], c)
    |> Query.perms_them_info(user_id)
    |> Query.limit_one()
    |> Repo.one()
  end

  def search_name(start_of_name) do
    search_str = start_of_name <> "%"

    Query.start()
    |> where([c], ilike(c.name, ^search_str) and c.isPrivate == false)
    |> limit([], 15)
    |> Repo.all()
  end

  def is_member?(userId, communityId) do
    query =
      from(c in CommunityMember, where: c.communityId == ^communityId and c.userId == ^userId)

    member = Repo.one(query)

    if is_nil(member) do
      false
    else
      true
    end
  end

  def get_community_members(communityId) do
    query =
      from(c in CommunityMember,
        join: u in User,
        on: u.id == c.userId,
        select: %User.Preview{
          avatarUrl: u.avatarUrl,
          displayName: u.displayName,
          username: u.username,
          id: u.id,
          bio: u.bio
        },
        where: c.communityId == ^communityId
      )

    Repo.all(query, [])
  end

  def get_community_permissions(communityId, userId) do
    query =
      from(cp in CommunityPermissions,
        where: cp.communityId == ^communityId and cp.userId == ^userId
      )

    Repo.one(query)
  end

  def get_community_id_by_thread_id(thread_id) do
    query =
      from(c in Channel,
        join: t in Thread,
        on: c.id == t.channelId,
        where: t.id == ^thread_id,
        select: %{
          communityId: c.communityId
        },
        limit: 1
      )

    Repo.one(query)
  end
end
