defmodule Telescope.Schemas.DmMessage do
  import Ecto.Changeset
  use Ecto.Schema

  alias Telescope.Schemas.Lodge
  alias Telescope.Schemas.User

  @derive {Jason.Encoder, only: [:lodge_id, :user_id, :text, :user, :inserted_at]}
  @primary_key {:id, :binary_id, []}
  schema "dm_messages" do
    field(:text, :string)

    belongs_to(:lodge, Lodge, foreign_key: :lodge_id, type: :binary_id)
    belongs_to(:user, User, foreign_key: :user_id, type: :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(message, attrs \\ %{}) do
    message
    |> cast(attrs, [:lodge_id, :text, :user_id])
    |> validate_required([:lodge_id, :text, :user_id])
  end
end
