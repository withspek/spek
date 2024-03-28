defmodule Operations.Access.Messages do
  alias Spek.Repo
  alias Operations.Queries.Messages, as: Query

  def get_thread_messages(threadId) do
    Query.start()
    |> Query.filter_by_thread_id(threadId)
    |> Repo.all()
    |> Repo.preload(:user)
  end
end
