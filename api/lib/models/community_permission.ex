defmodule Models.CommunityPermissions do
  alias Models.User
  alias Models.Community
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: ~w(isAdmin isMod isMember isBlocked)a}
  @primary_key {:id, :binary_id, []}
  schema "community_permissions" do
    field(:isAdmin, :boolean, default: false)
    field(:isMember, :boolean, default: false)
    field(:isBlocked, :boolean, default: false)
    field(:isMod, :boolean, default: false)
    belongs_to(:community, Community, foreign_key: :communityId, type: :binary_id)
    belongs_to(:user, User, foreign_key: :userId, type: :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(permission, params \\ %{}) do
    permission
    |> cast(params, [:isAdmin, :isMod, :userId, :communityId])
    |> validate_required([:isAdmin, :isMod, :userId, :communityId])
  end
end
