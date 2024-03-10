defmodule Operations.Access.Channels do
  import Ecto.Query, warn: false

  alias Models.Thread
  alias Operations.Queries.Channels, as: Query
  alias Spek.Repo

  def get_channel_by_id(id) do
    Query.start()
    |> Query.filter_by_id(id)
    |> Query.limit_one()
    |> Repo.all()
  end

  def get_channels_by_community_id(id) do
    Query.start()
    |> Query.filter_by_community_id(id)
    |> Repo.all()
  end

  def get_threads_by_channel_id(id) do
    from(th in Thread, where: th.channelId == ^id) |> Repo.all()
  end
end
