defmodule Telescope.Schemas.ConfPermission do
  use Ecto.Schema
  import Ecto.Changeset

  alias Telescope.Schemas.User
  alias Telescope.Schemas.Conf
  @timestamps_opts [type: :utc_datetime_usec]

  @derive {Jason.Encoder, only: ~w(is_speaker is_mod asked_to_speak)a}
  @primary_key false
  schema "conf_permissions" do
    field(:is_mod, :boolean)
    field(:is_speaker, :boolean)
    field(:asked_to_speak, :boolean)

    belongs_to(:user, User, foreign_key: :user_id, type: :binary_id)
    belongs_to(:conf, Conf, foreign_key: :conf_id, type: :binary_id)

    timestamps()
  end

  def insert_changeset(confPerm, attrs) do
    confPerm
    |> cast(attrs, [:user_id, :conf_id, :is_spek, :is_mod, :asked_to_speak])
    |> validate_required([:user_id, :conf_id])
  end
end
