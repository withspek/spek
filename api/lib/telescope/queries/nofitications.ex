defmodule Telescope.Queries.Nofitications do
  import Ecto.Query

  alias Telescope.Schemas.Notification

  def start() do
    from(n in Notification)
  end

  def filter_by_id(query, id) do
    where(query, [n], n.id == ^id)
  end

  def filter_by_read(query, read) do
    where(query, [n], n.read == ^read)
  end

  def filter_by_user_id(query, user_id) do
    where(query, [n], n.user_id == ^user_id)
  end

  def update_set_read_true(query) do
    update(query,
      set: [
        read: true
      ]
    )
  end

  def update_set_read_false(query) do
    update(query,
      set: [
        read: false
      ]
    )
  end
end
