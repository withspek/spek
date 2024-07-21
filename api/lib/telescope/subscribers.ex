defmodule Telescope.Subscribers do
  import Ecto.Query, warn: false

  alias Telescope.Schemas.Subscriber
  alias Telescope.Repo

  def raw_insert(thread_id, user_id) do
    Subscriber.changeset(%Subscriber{subscriberId: user_id, threadId: thread_id})
    |> Repo.insert!(returning: true)
  end

  def delete(thread_id, user_id) do
    from(sub in Subscriber, where: sub.threadId == ^thread_id and sub.subscriberId == ^user_id)
    |> Repo.delete_all()
  end
end
