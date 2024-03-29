defmodule Models.Dm do
  alias Models.User

  use Ecto.Schema
  import Ecto.Changeset

  defmodule Reply do
    use Ecto.Schema

    @derive {Jason.Encoder, only: ~w(id read displayName avatarUrl message online inserted_at)a}
    @primary_key false
    embedded_schema do
      field(:id, :binary_id)
      field(:read, :boolean)
      field(:displayName, :string)
      field(:avatarUrl, :string)
      field(:message, :string)
      field(:online, :boolean)
      field(:inserted_at, :utc_datetime_usec)
    end
  end

  @derive {Jason.Encoder, only: ~w(id read1 read2 inserted_at updated_at)a}
  @primary_key {:id, :binary_id, []}
  schema "dms" do
    field(:read1, :boolean, default: false)
    field(:read2, :boolean, default: false)

    belongs_to(:user1, User, foreign_key: :userId1, type: :binary_id)
    belongs_to(:user2, User, foreign_key: :userId2, type: :binary_id)

    timestamps()
  end

  def changeset(dm, attrs) do
    dm
    |> cast(attrs, [:read1, :read2])
    |> validate_required([:read1, :read2])
  end
end
