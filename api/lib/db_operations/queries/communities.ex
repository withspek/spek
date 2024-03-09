defmodule Operations.Queries.Communities do
  alias Models.Community
  import Ecto.Query

  def start do
    from(c in Community)
  end

  def filter_by_id(query, id) do
    where(query, [c], c.id == ^id)
  end

  def inc_member_count(query, n) do
    update(query,
      inc: [
        memberCount: ^n
      ]
    )
  end
end
