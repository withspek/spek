defmodule Telescope.Mutations.Nofitications do
  import Ecto.Query, warn: false

  alias Telescope.Queries.Nofitications, as: Query
  alias Telescope.Schemas.Notification
  alias Telescope.Repo

  def create_notification(data) do
    %Notification{}
    |> Notification.changeset(data)
    |> Repo.insert(returning: true)
  end

  def mark_as_read(id) do
    Query.start()
    |> Query.filter_by_id(id)
    |> Query.update_set_read_true()
    |> Repo.update_all([])
  end

  def mark_as_unread(id) do
    Query.start()
    |> Query.filter_by_id(id)
    |> Query.update_set_read_false()
    |> Repo.update_all([])
  end
end
