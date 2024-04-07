defmodule Operations.Mutations.Community do
  import Ecto.Query, warn: false

  alias Operations.Communities
  alias Models.CommunityPermissions
  alias Models.ChannelMember
  alias Models.CommunityMember
  alias Models.Channel
  alias Ecto.Multi
  alias Models.Community
  alias Spek.Repo
  alias Operations.Queries.Communities, as: Query

  def create_community(data) do
    user_id = data["ownerId"]

    multi_struct =
      Multi.new()
      |> Multi.insert(
        :community,
        Community.changeset(%Community{
          id: Ecto.UUID.autogenerate(),
          name: data["name"],
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

      {:error, :channel, channel_changeset} ->
        IO.puts(channel_changeset)
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
end
