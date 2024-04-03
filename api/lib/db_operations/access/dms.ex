defmodule Operations.Access.Dms do
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
      from(dm in Dm,
        join: du in DmUser,
        on: du.dmId == dm.id,
        where: du.userId == ^user_id,
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

  def get_dm_messages(dm_id) do
    query =
      from(m in DmMessage, where: m.dmId == ^dm_id, limit: 60)

    Repo.all(query) |> Repo.preload(:user)
  end
end
