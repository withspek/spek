defmodule Operations.Access.Communities do
  import Ecto.Query

  alias Models.Channel
  alias Models.Thread
  alias Models.CommunityPermissions
  alias Models.CommunityMember
  alias Models.User
  alias Spek.Repo
  alias Models.Community
  alias Operations.Queries.Communities, as: Query

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

  def get_community_by_id(id, user_id) do
    Query.start()
    |> Query.filter_by_id(id)
    |> select([c], c)
    |> Query.perms_them_info(user_id)
    |> Query.limit_one()
    |> Repo.one()
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
