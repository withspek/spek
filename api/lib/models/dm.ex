defmodule Models.Dm do
  alias Models.User

  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, []}
  schema "dms" do
    field(:blocked, :boolean, default: false)
    field(:read1, :boolean, default: false)
    field(:read2, :boolean, default: false)

    belongs_to(:user1, User, foreign_key: :userId1, type: :binary_id)
    belongs_to(:user2, User, foreign_key: :userId2, type: :binary_id)

    timestamps()
  end

  def changeset(dm, attrs) do
    dm
    |> cast(attrs, [:blocked, :read1, :read2])
    |> validate_required([:blocked, :read1, :read2])
  end
end
