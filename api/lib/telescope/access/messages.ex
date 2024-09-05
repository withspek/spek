defmodule Telescope.Access.Messages do
  @fetch_limit 21

  import Ecto.Query

  alias Telescope.Schemas.Message
  alias Telescope.Repo
  alias Telescope.Queries.Messages, as: Query, warn: false

  def get_thread_messages(threadId, offset \\ 20) do
    messages =
      from(m in Message,
        where: m.threadId == ^threadId,
        limit: ^@fetch_limit,
        offset: ^offset,
        join: u in assoc(m, :user),
        preload: [user: u],
        order_by: [desc: m.inserted_at]
      )
      |> Repo.all()

    {Enum.slice(messages, 0, -1 + @fetch_limit),
     if(length(messages) == @fetch_limit, do: -1 + offset + @fetch_limit, else: nil)}
  end

  @spec get_message_by_id(any()) :: any()
  def get_message_by_id(message_id) do
    from(m in Message,
      where: m.id == ^message_id,
      limit: 1,
      join: u in assoc(m, :user),
      preload: [user: u]
    )
    |> Repo.one()
  end
end
