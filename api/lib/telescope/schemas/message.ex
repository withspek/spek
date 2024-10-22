defmodule Telescope.Schemas.Message do
  import Ecto.Changeset
  use Ecto.Schema

  alias Telescope.Schemas.User
  alias Telescope.Schemas.Thread

  @derive {Jason.Encoder, only: ~w(id text user inserted_at updated_at threadId)a}
  @primary_key {:id, :binary_id, []}
  schema "messages" do
    field(:text, :string)

    belongs_to(:user, User, foreign_key: :userId, type: :binary_id)
    belongs_to(:thread, Thread, foreign_key: :threadId, type: :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(message, params \\ %{}) do
    message
    |> cast(params, [:text, :userId, :threadId])
    |> validate_required([:text, :userId, :threadId])
  end

  def edit_changeset(message, params \\ %{}) do
    message
    |> cast(params, [:text, :userId])
    |> validate_required([:text, :userId])
  end
end
