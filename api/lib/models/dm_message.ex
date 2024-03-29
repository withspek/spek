defmodule Models.DmMessage do
  import Ecto.Changeset
  use Ecto.Schema

  alias Models.User
  alias Models.Dm

  @derive {Jason.Encoder, only: [:dm_id, :user_id, :text, :inserted_at]}
  @primary_key {:id, :binary_id, []}
  schema "dm_messages" do
    field(:text, :string)

    belongs_to(:dm, Dm, foreign_key: :dm_id, type: :binary_id)
    belongs_to(:user, User, foreign_key: :user_id, type: :binary_id)

    timestamps()
  end

  def changeset(message, attrs) do
    message
    |> cast(attrs, [:dm_id, :text, :user_id])
    |> validate_required([:dm_id, :text, :user_id])
  end
end
