defmodule Telescope.Mutations.Community do
  import Ecto.Query, warn: false

  alias Ecto.Multi
  alias Telescope.Repo
  alias Telescope.Communities
  alias Telescope.Schemas.ChannelMember
  alias Telescope.Schemas.CommunityMember
  alias Telescope.Schemas.Channel
  alias Telescope.Schemas.Community
  alias Telescope.Access.Channels
  alias Telescope.Schemas.CommunityPermissions
  alias Telescope.Queries.Communities, as: Query

  def create_community(data) do
    user_id = data["ownerId"]
    community_name = String.trim(data["name"])

    multi_struct =
      Multi.new()
      |> Multi.insert(
        :community,
        Community.changeset(%Community{
          id: Ecto.UUID.autogenerate(),
          name: community_name,
          slug: String.downcase(Enum.join(String.split(community_name, " "), "_")),
          isPrivate: false,
          ownerId: user_id,
          description: data["description"]
        })
      )
      |> Multi.insert(:channel, fn %{community: community} ->
        Channel.changeset(%Channel{
          id: Ecto.UUID.autogenerate(),
          description: "This is where all threads start",
          name: "general",
          slug: "general",
          creatorId: user_id,
          isPrivate: false,
          isDefault: true
        })
        |> Ecto.Changeset.put_assoc(:community, community)
      end)

    case Repo.transaction(multi_struct) do
      {:ok, %{community: community, channel: channel}} ->
        CommunityMember.changeset(%CommunityMember{
          communityId: community.id,
          userId: user_id
        })
        |> Repo.insert()

        ChannelMember.changeset(%ChannelMember{channelId: channel.id, userId: user_id})
        |> Repo.insert()

        CommunityPermissions.changeset(%CommunityPermissions{
          communityId: community.id,
          isAdmin: true,
          isMod: true,
          isMember: true,
          userId: user_id
        })
        |> Repo.insert()

        {:ok, community, channel}

      {:error, :community, changeset_error, _changes_happened} ->
        {:error, changeset_error}
    end
  end

  def join_community(communityId, userId) do
    community = Communities.get_community_by_id(communityId, userId)

    case community do
      community ->
        member = Communities.is_member?(communityId, userId)
        IO.inspect(member)

        if not member do
          Query.start()
          |> Query.filter_by_id(communityId)
          |> Query.inc_member_count(1)
          |> Repo.update_all([])

          CommunityMember.changeset(%CommunityMember{communityId: community.id, userId: userId})
          |> Repo.insert()

          CommunityPermissions.changeset(%CommunityPermissions{
            communityId: communityId,
            isMember: true,
            isAdmin: false,
            isBlocked: false,
            isMod: false,
            userId: userId
          })
          |> Repo.insert()
        end

        {:ok, true}
    end
  end

  def leave_community(community_id, user_id) do
    Query.start_member()
    |> Query.filter_by_member(community_id, user_id)
    |> Repo.delete_all()

    Query.start()
    |> Query.filter_by_id(community_id)
    |> Query.inc_member_count(-1)
    |> Repo.update_all([])

    Query.start_permissions()
    |> Query.filter_by_permissions(community_id, user_id)
    |> Repo.delete_all()

    channels = Channels.get_channels_by_community_id(community_id, user_id)

    Enum.each(channels, fn channel ->
      Telescope.Mutations.Channels.leave_channel(channel.id, user_id)
    end)
  end

  def delete_community(community_id, user_id) do
    Query.start()
    |> where([c], c.id == ^community_id and c.ownerId == ^user_id)
    |> Repo.delete_all()
  end

  def update_community(community_id, data, user_id) do
    community_id
    |> Communities.get_community_by_id(user_id)
    |> Community.edit_changeset(data)
    |> Repo.update()
  end
end
