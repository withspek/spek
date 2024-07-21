defmodule Telescope.Queries.Communities do
  import Ecto.Query

  alias Telescope.Schemas.CommunityMember
  alias Telescope.Schemas.CommunityPermissions
  alias Telescope.Schemas.Community

  def start do
    from(c in Community)
  end

  def start_member do
    from(cm in CommunityMember)
  end

  def start_permissions do
    from(cp in CommunityPermissions)
  end

  def filter_by_id(query, id) do
    where(query, [c], c.id == ^id)
  end

  def filter_by_slug(query, slug) do
    where(query, [c], c.slug == ^slug)
  end

  def filter_by_member(query, community_id, user_id) do
    where(query, [cm], cm.communityId == ^community_id and cm.userId == ^user_id)
  end

  def filter_by_permissions(query, community_id, user_id) do
    where(query, [cm], cm.communityId == ^community_id and cm.userId == ^user_id)
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
