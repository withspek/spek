defmodule Telescope.Mutations.Channels do
  import Ecto.Query, warn: false

  alias Ecto.Multi
  alias Telescope.Schemas.Channel
  alias Telescope.Schemas.Thread
  alias Telescope.Schemas.ChannelMember
  alias Telescope.Queries.Channels, as: Query
  alias Telescope.Channels
  alias Telescope.Users
  alias Telescope.Repo

  def create_channel(data, user_id) do
    channel_name = String.trim(data.name)

    multi_struct =
      Multi.new()
      |> Multi.insert(
        :channel,
        Channel.changeset(%Channel{
          id: Ecto.UUID.autogenerate(),
          name: channel_name,
          slug: String.downcase(Enum.join(String.split(channel_name, " "), "_")),
          isPrivate: false,
          communityId: data.communityId,
          creatorId: data.creatorId,
          memberCount: 1,
          description: data.description
        })
      )
      |> Multi.insert(:channel_member, fn %{channel: channel} ->
        ChannelMember.changeset(%ChannelMember{
          id: Ecto.UUID.autogenerate(),
          channelId: channel.id,
          userId: user_id
        })
        |> Ecto.Changeset.put_assoc(:channel, channel)
      end)

    case Repo.transaction(multi_struct) do
      {:ok, %{channel: channel, channel_member: channel_member}} ->
        channel = channel |> Repo.preload(:community)
        {:ok, channel, channel_member}

      {:error, :community, changeset_error, _changes_happened} ->
        {:error, changeset_error}
    end
  end

  def join_channel(channel_id, user_id) do
    channel = Channels.get_channel_by_id(channel_id, user_id)

    if not is_nil(channel) do
      Query.start()
      |> Query.filter_by_id(channel_id)
      |> Query.inc_member_count(1)
      |> Repo.update_all([])

      ChannelMember.changeset(%ChannelMember{channelId: channel.id, userId: user_id})
      |> Repo.insert()

      {:ok, channel}
    else
      {:error, %{error: "Not found"}}
    end
  end

  def delete_channel(channel_id, user_id) do
    channel = Channels.get_channel_by_id(channel_id, user_id)

    if not is_nil(channel) and channel.isAdmin do
      Query.start()
      |> Query.filter_by_id(channel_id)
      |> Repo.delete_all()
    else
      {:error, %{error: "Not found"}}
    end
  end

  def leave_channel(channel_id, user_id) do
    Query.start()
    |> Query.filter_by_id(channel_id)
    |> Query.inc_member_count(-1)
    |> Repo.update_all([])

    Query.start_member()
    |> Query.filter_by_member(channel_id, user_id)
    |> Repo.delete_all()
  end

  def update_channel(channel_id, data, user_id) do
    channel_id
    |> Channels.get_channel_by_id(user_id)
    |> Channel.edit_changeset(data)
    |> Repo.update()
  end

  def create_thread(data) do
    user = Users.get_user_id(data.creatorId)

    previewList = [
      %{
        avatarUrl: user.avatarUrl,
        id: user.id,
        bio: user.bio,
        displayName: user.displayName,
        online: user.online,
        lastOnline: user.lastOnline
      }
    ]

    Thread.changeset(%Thread{
      channelId: data.channelId,
      creatorId: data.creatorId,
      communityId: data.communityId,
      name: data.name,
      peoplePreviewList: previewList
    })
    |> Repo.insert!(returning: true)
    |> Repo.preload(:creator)
  end
end
