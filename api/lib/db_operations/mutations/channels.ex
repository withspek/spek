defmodule Operations.Mutations.Channels do
  import Ecto.Query, warn: false

  alias Operations.Users
  alias Models.Thread
  alias Models.ChannelMember
  alias Operations.Queries.Channels, as: Query
  alias Operations.Channels
  alias Spek.Repo

  def join_channel(channelId, userId) do
    channel = Channels.get_channel_by_id(channelId)

    if not is_nil(channel) do
      Query.start()
      |> Query.filter_by_id(channelId)
      |> Query.inc_member_count(1)
      |> Repo.update_all([])

      ChannelMember.changeset(%ChannelMember{channelId: channel.id, userId: userId})
      |> Repo.insert()
    else
      {:error, %{error: "Not found"}}
    end
  end

  def leave_channel(channel_id, user_id) do
    Query.start_member()
    |> Query.filter_by_member(channel_id, user_id)
    |> Repo.delete_all()
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
