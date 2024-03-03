defmodule Operations.Access.Communities do
  alias Spek.Repo
  alias Models.Community
  import Ecto.Query

  def get_top_communities(limit) do
    query = from(c in Community, limit: ^limit, order_by: c.memberCount)

    Repo.all(query)
  end
end
