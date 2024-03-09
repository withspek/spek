defmodule Models.Thread do
  import Ecto.Changeset
  use Ecto.Schema

  alias Models.Channel
  alias Models.User

  @derive {Jason.Encoder, only: ~w(id name creatorId channelId)a}
  @primary_key {:id, :binary_id, []}
  schema "threads" do
    field(:name, :string)

    belongs_to(:creator, User, foreign_key: :creatorId, type: :binary_id)
    belongs_to(:channel, Channel, foreign_key: :channelId, type: :binary_id)

    timestamps()
  end

  def changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:name, :ownerId, :channelId])
    |> validate_required([:channelId, :ownerId, :name])
  end
end