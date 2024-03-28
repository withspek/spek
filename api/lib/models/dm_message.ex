defmodule Models.DmMessage do
  import Ecto.Changeset
  use Ecto.Schema

  alias Models.User
  alias Models.Dm

  @primary_key {:id, :binary_id, []}
  schema "dm_messages" do
    field(:text, :string)

    belongs_to(:dm, Dm, foreign_key: :dmId, type: :binary_id)

    belongs_to(:recipient, User, foreign_key: :recipientId, type: :binary_id)
    belongs_to(:sender, User, foreign_key: :senderId, type: :binary_id)

    timestamps()
  end

  def changeset(message, attrs) do
    message
    |> cast(attrs, [:dmId, :text, :senderId, :recipientId])
  end
end
