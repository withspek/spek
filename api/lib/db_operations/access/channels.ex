defmodule Operations.Access.Channels do
  import Ecto.Query, warn: false

  alias Operations.Queries.Channels, as: Query
  alias Spek.Repo

  def get_channel_by_id(id) do
    Query.start()
    |> Query.filter_by_id(id)
    |> Query.limit_one()
    |> Repo.all()
  end
end
