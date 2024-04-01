defmodule Models.DmMessage do
  import Ecto.Changeset
  use Ecto.Schema

  alias Models.User
  alias Models.Dm

  @derive {Jason.Encoder, only: [:dmId, :userId, :text, :user, :inserted_at]}
  @primary_key {:id, :binary_id, []}
  schema "dm_messages" do
    field(:text, :string)

    belongs_to(:dm, Dm, foreign_key: :dmId, type: :binary_id)
    belongs_to(:user, User, foreign_key: :userId, type: :binary_id)

    timestamps()
  end

  def changeset(message, attrs \\ %{}) do
    message
    |> cast(attrs, [:dmId, :text, :userId])
    |> validate_required([:dmId, :text, :userId])
  end
end
