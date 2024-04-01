defmodule Operations.Access.Dms do
  import Ecto.Query, warn: false

  alias Models.DmUser
  alias Models.Dm
  alias Spek.Repo

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

  def get_dm_by_user_ids(user_id_1, user_id_2) do
    query =
      from(d in Dm,
        join: du in DmUser,
        on: du.dmId == d.id,
        where: du.userId == ^user_id_1 or du.userId == ^user_id_2,
        limit: 1
      )

    Repo.one(query)
  end
end
