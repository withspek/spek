defmodule Operations.Queries.Communities do
  alias Models.CommunityPermissions
  alias Models.Community
  import Ecto.Query

  def start do
    from(c in Community)
  end

  def filter_by_id(query, id) do
    where(query, [c], c.id == ^id)
  end

  def inc_member_count(query, n) do
    update(query,
      inc: [
        memberCount: ^n
      ]
    )
  end

  def perms_them_info(query, me_id) do
    query
    |> join(:left, [c], up in CommunityPermissions,
      as: :permissions,
      on: up.communityId == c.id and up.userId == ^me_id
    )
    |> select_merge([permissions: up], %{
      isAdmin: up.isAdmin,
      isMember: up.isMember,
      isMod: up.isMod,
      isBlocked: up.isBlocked
    })
  end

  def limit_one(query) do
    limit(query, [], 1)
  end
end
