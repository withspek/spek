defmodule Operations.Access.Dms do
  import Ecto.Query, warn: false

  alias Models.Dm
  alias Spek.Repo

  def get_dm_by_user_ids(user_id_1, user_id_2) do
    query =
      from(d in Dm,
        where:
          (d.userId1 == ^user_id_1 and d.userId2 == ^user_id_2) or
            (d.userId1 == ^user_id_2 and d.userId2 == ^user_id_2)
      )

    Repo.one(query)
  end
end
