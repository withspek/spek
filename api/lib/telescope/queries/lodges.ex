defmodule Telescope.Queries.Lodges do
  import Ecto.Query, warn: false

  alias Telescope.Schemas.Lodge

  def start() do
    from(l in Lodge)
  end

  def filter_by_id(query, id) do
    where(query, [l], l.id == ^id)
  end

  def filter_by_type(query, type) do
    where(query, [l], l.type == ^type)
  end

  def filter_by_owner_id(query, lodge_id, owner_id) do
    where(query, [l], l.id == ^lodge_id and l.owner_id == ^owner_id)
  end
end
