defmodule Operations.Access.Dms do
  @fetch_limit 21

  import Ecto.Query, warn: false

  alias Models.DmMessage
  alias Models.DmUser
  alias Models.Dm
  alias Spek.Repo

  def all_dms_ids() do
    from(d in Dm, select: d.id)
    |> Repo.all()
  end

  def get_dm_by_id(dm_id) do
    query = from(dm in Dm, where: dm.id == ^dm_id, limit: 1)
    Repo.one(query)
  end

  def get_user_dms(user_id) do
    query =
      from(d in Dm,
        join: du in DmUser,
        on: du.dmId == d.id,
        where: du.userId == ^user_id,
        order_by: [desc: d.inserted_at],
        limit: 150
      )

    Repo.all(query)
  end

  def dm_exists?(user_id_1, user_id_2) do
    query =
      from(d in Dm,
        join: du in DmUser,
        on: du.dmId == d.id,
        where: du.userId in ^[user_id_1, user_id_2],
        group_by: d.id,
        having: count(du.userId) == 2,
        select: d.id
      )

    case Repo.one(query) do
      nil -> false
      _ -> true
    end
  end

  def get_dm_by_user_ids(user_id_1, user_id_2) do
    query =
      from(d in Dm,
        join: du in DmUser,
        on: du.dmId == d.id,
        where: du.userId in ^[user_id_1, user_id_2],
        group_by: d.id,
        having: count(du.userId) == 2
      )

    Repo.one(query)
  end

  def get_dm_messages(dm_id, offset \\ 20) do
    messages =
      from(m in DmMessage,
        where: m.dmId == ^dm_id,
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
