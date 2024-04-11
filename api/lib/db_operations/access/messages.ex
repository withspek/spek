defmodule Operations.Access.Messages do
  @fetch_limit 21
  import Ecto.Query

  alias Models.Message
  alias Spek.Repo
  alias Operations.Queries.Messages, as: Query, warn: false

  def get_thread_messages(threadId, offset \\ 20) do
    messages =
      from(m in Message,
        where: m.threadId == ^threadId,
        limit: ^@fetch_limit,
        offset: ^offset,
        order_by: [desc: m.inserted_at]
      )
      |> Repo.all()
      |> Repo.preload(:user)

    {Enum.slice(messages, 0, -1 + @fetch_limit),
     if(length(messages) == @fetch_limit, do: -1 + offset + @fetch_limit, else: nil)}
  end
end
