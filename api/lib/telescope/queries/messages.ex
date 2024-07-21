defmodule Telescope.Queries.Messages do
  import Ecto.Query

  alias Telescope.Schemas.Message

  def start() do
    from(m in Message)
  end

  def filter_by_id(query, id) do
    where(query, [m], m.id == ^id)
  end

  def filter_by_thread_id(query, id) do
    where(query, [m], m.threadId == ^id)
  end
end
