defmodule Telescope.Schemas.Invite do
  @moduledoc """
  Schema for invites table used to store user invite for DMs and Communities

  Invite types:

  1. COMMUNITY -> 1
  2. GROUP_DM -> 2
  """

  use Ecto.Schema
  import Ecto.Changeset

  alias Telescope.Schemas.Community
  alias Telescope.Schemas.User
  alias Telescope.Schemas.Lodge

  @primary_key {:id, :binary_id, []}
  @timestamps_opts [:utc_datetime_usec]
  schema "invites" do
    field(:type, :integer, default: 2)
    field(:code, :binary_id)
    field(:read, :boolean, default: false)
    field(:approximate_member_count, :integer, virtual: 2)
    field(:expires_at, :utc_datetime_usec)

    belongs_to(:inviter, User, foreign_key: :inviter_id, type: :binary_id)
    # Group DM
    belongs_to(:lodge, Lodge, foreign_key: :lodge_id, type: :binary_id)
    belongs_to(:community, Community, foreign_key: :community_id, type: :binary_id)

    timestamps()
  end

  def changeset(invite, params \\ %{}) do
    invite
    |> cast(params, [:type, :code, :inviter_id, :lodge_id, :community_id])
    |> validate_required([:type, :code])
  end
end
