defmodule Operations.Mutations.Dms do
  import Ecto.Query, warn: false

  alias Models.Dm
  alias Spek.Repo
  alias Operations.Dms

  def raw_insert(user_id_1, user_id_2) do
    %Dm{userId1: user_id_1, userId2: user_id_2}
    |> Repo.insert!()
  end

  def create_dm(user_id_1, user_id_2) do
    dm = Dms.get_dm_by_user_ids(user_id_1, user_id_2)

    case not is_nil(dm) do
      true ->
        raw_insert(user_id_1, user_id_2)

      false ->
        dm
    end
  end
end
