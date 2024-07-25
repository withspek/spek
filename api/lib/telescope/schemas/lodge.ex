defmodule Telescope.Schemas.Lodge do
  @moduledoc """
   Lodges provide temporary quarters for users who want to chat.
   This schema represents a DM or Group DM in the UI.

   The Lodge types are the following:
    1. DM Lodge represented by `1`
    2. Group DM Lodge represented by `2`

  """
  use Ecto.Schema
  import Ecto.Changeset

  alias Telescope.Schemas.User

  @derive {Jason.Encoder,
           only: ~w(id type message_count last_message_id member_count nsfw recipients owner_id)a}
  @primary_key {:id, :binary_id, []}
  @timestamps_opts [:utc_datetime_usec]
  schema "lodges" do
    field(:type, :integer, default: 1)
    field(:member_count, :integer)
    field(:nsfw, :boolean, default: false)
    field(:message_count, :integer, virtual: true)
    field(:last_message_id, :binary_id)
    field(:user_limit, :integer, default: 100)

    belongs_to(:owner, User, foreign_key: :owner_id, type: :binary_id)

    embeds_many(:recipients, User.Preview)

    timestamps()
  end

  def changeset(lodge, params \\ %{}) do
    lodge
    |> cast(params, [:type, :name, :owner_id])
    |> validate_required([:name, :owner_id])
  end
end
