defmodule Operations.Mutations.Channels do
  import Ecto.Query, warn: false

  alias Models.ChannelMember
  alias Operations.Queries.Channels, as: Query
  alias Operations.Channels
  alias Spek.Repo

  def join_channel(channelId, userId) do
    db_channel = Channels.get_channel_by_id(channelId)

    case db_channel do
      {:ok, channel} ->
        Query.start()
        |> Query.filter_by_id(channelId)
        |> Query.inc_member_count(1)
        |> Repo.update_all([])

        ChannelMember.changeset(%ChannelMember{channelId: channel.id, userId: userId})
        |> Repo.insert()

      _ ->
        {:error, %{error: "Not found"}}
    end
  end
end
