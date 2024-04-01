defmodule Operations.Mutations.Dms do
  alias Spek.Repo
  alias Operations.Users
  alias Models.DmUser
  alias Models.Dm
  alias Ecto.Multi
  import Ecto.Query, warn: false

  def create_dm(user_ids) do
    peoplePreviewList = []

    Enum.each(user_ids, fn id ->
      user = Users.get_user_id(id)
      peoplePreviewList ++ user
    end)

    multi_struct =
      Multi.new()
      |> Multi.insert(
        :dm,
        Dm.changeset(%Dm{
          id: Ecto.UUID.autogenerate(),
          peoplePreviewList: peoplePreviewList
        })
      )
      |> Multi.insert(:user, fn %{dm: dm} ->
        Enum.each(user_ids, fn user_id ->
          %DmUser{
            id: Ecto.UUID.autogenerate(),
            dm_id: dm.id,
            user_id: user_id
          }
        end)
      end)

    case Repo.transaction(multi_struct) do
      {:ok, %{dm: dm, user: dm_user}} ->
        IO.inspect(dm)
        IO.inspect(dm_user)

      {:error, changeset} ->
        IO.inspect(changeset)
    end
  end
end
