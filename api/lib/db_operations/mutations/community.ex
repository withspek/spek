defmodule Operations.Mutations.Community do
  import Ecto.Query, warn: false

  alias Operations.Access.Users
  alias Models.Thread
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
    multi_struct =
      Multi.new()
      |> Multi.insert(
        :community,
        Community.changeset(%Community{
          id: Ecto.UUID.autogenerate(),
          name: data["name"],
          isPrivate: false,
          ownerId: data["ownerId"],
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
          userId: data["ownerId"]
        })
        |> Repo.insert()

        ChannelMember.changeset(%ChannelMember{channelId: channel.id, userId: data["ownerId"]})
        |> Repo.insert()

        CommunityPermissions.changeset(%CommunityPermissions{
          communityId: community.id,
          isAdmin: true,
          isMod: true,
          isMember: true,
          userId: data["ownerId"]
        })
        |> Repo.insert()

        {:ok, community, channel}

      {:error, :channel, channel_changeset} ->
        IO.puts(channel_changeset)
    end
  end

  def join_community(communityId, userId) do
    community = Communities.get_community_by_id(communityId)

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

  @spec create_thread(
          atom()
          | %{:channelId => any(), :creatorId => any(), :name => any(), optional(any()) => any()}
        ) :: any()
  def create_thread(data) do
    user = Users.get_user_id(data.creatorId)

    previewList = [
      %{
        avatarUrl: user.avatarUrl,
        id: user.id,
        bio: user.bio,
        displayName: user.displayName
      }
    ]

    Thread.changeset(%Thread{
      channelId: data.channelId,
      creatorId: data.creatorId,
      name: data.name,
      peoplePreviewList: previewList
    })
    |> Repo.insert!(returning: true)
  end
end
