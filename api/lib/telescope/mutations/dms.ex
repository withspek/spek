defmodule Telescope.Mutations.Dms do
  import Ecto.Query, warn: false

  alias Ecto.Multi
  alias Pulse.DmSession
  alias Telescope.Schemas.DmMessage
  alias Telescope.Repo
  alias Telescope.Users
  alias Telescope.Schemas.Dm
  alias Telescope.Schemas.DmUser

  def create_dm(user_ids) do
    peoplePreviewList =
      Enum.map(user_ids, fn id ->
        user = Users.get_user_id(id)

        %{
          id: user.id,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          displayName: user.displayName
        }
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

    # TODO: REMOVE THE TRANSACTION
    case Repo.transaction(multi_struct) do
      {:ok, %{dm: dm}} ->
        Enum.each(user_ids, fn user_id ->
          DmUser.changeset(%DmUser{
            id: Ecto.UUID.autogenerate(),
            dmId: dm.id,
            userId: user_id
          })
          |> Repo.insert!()
        end)

        DmSession.start_supervised(dm_id: dm.id)

        Enum.each(user_ids, fn user_id ->
          DmSession.join_dm(dm.id, user_id)
        end)

        dm

      {:error, changeset} ->
        IO.inspect(changeset)
    end
  end

  def create_dm_message(dm_id, user_id, text) do
    DmMessage.changeset(%DmMessage{dmId: dm_id, userId: user_id, text: text})
    |> Repo.insert!()
    |> Repo.preload(:user)
  end
end
