defmodule Models.DmUser do
  import Ecto.Changeset
  use Ecto.Schema

  alias Models.User
  alias Models.Dm

  @primary_key {:id, :binary_id, []}
  schema "dm_users" do
    belongs_to(:dm, Dm, foreign_key: :dm_id, type: :binary_id)
    belongs_to(:user, User, foreign_key: :user_id, type: :binary_id)

    timestamps()
  end

  def changeset(user, attrs \\ %{}) do
    user
    |> cast(attrs, [:dm_id, :user_id])
    |> validate_required([:dm_id, :user_id])
  end
end
