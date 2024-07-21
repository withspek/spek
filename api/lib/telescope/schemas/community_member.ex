defmodule Telescope.Schemas.CommunityMember do
  use Ecto.Schema
  import Ecto.Changeset

  alias Telescope.Schemas.User
  alias Telescope.Schemas.Community

  @derive {Jason.Encoder, only: ~w(id userId communityId)a}
  @primary_key {:id, :binary_id, []}
  schema "community_members" do
    belongs_to(:community, Community, foreign_key: :communityId, type: :binary_id)
    belongs_to(:user, User, foreign_key: :userId, type: :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(member, params \\ %{}) do
    member
    |> cast(params, [:communityId, :userId])
    |> validate_required([:communityId, :userId])
  end
end
