defmodule Telescope.Schemas.DmUser do
  import Ecto.Changeset
  use Ecto.Schema

  alias Telescope.Schemas.User
  alias Telescope.Schemas.Dm

  @primary_key {:id, :binary_id, []}
  schema "dm_users" do
    belongs_to(:dm, Dm, foreign_key: :dmId, type: :binary_id)
    belongs_to(:user, User, foreign_key: :userId, type: :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(user, attrs \\ %{}) do
    user
    |> cast(attrs, [:dmId, :userId])
    |> validate_required([:dmId, :userId])
  end
end
