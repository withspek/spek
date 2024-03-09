defmodule Operations.Access.Communities do
  alias Spek.Repo
  alias Models.Community
  import Ecto.Query

  def get_top_communities(limit) do
    query = from(c in Community, limit: ^limit, order_by: c.memberCount)

    Repo.all(query)
  end

  def get_community_by_id(id) do
    query = from(c in Community, limit: 1, where: c.id == ^id)

    Repo.one(query)
  end
end
