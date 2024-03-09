defmodule Operations.Access.Communities do
  import Ecto.Query

  alias Models.CommunityPermissions
  alias Models.User.UserPreview
  alias Models.CommunityMember
  alias Models.User
  alias Spek.Repo
  alias Models.Community

  def get_top_communities(limit) do
    query = from(c in Community, limit: ^limit, order_by: c.memberCount)

    Repo.all(query)
  end

  def get_community_by_id(id) do
    from(c in Community, limit: 1, where: c.id == ^id) |> Repo.one()
  end

  def get_community_members(communityId) do
    query =
      from(c in CommunityMember,
        join: u in User,
        on: u.id == c.userId,
        select: %UserPreview{
          avatarUrl: u.avatarUrl,
          displayName: u.displayName,
          id: u.id,
          online: u.online,
          username: u.username,
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
end
