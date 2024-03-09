defmodule Models.CommunityMember do
  alias Models.User
  alias Models.Community
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: ~w(id userId communityId)a}
  @primary_key {:id, :binary_id, []}
  schema "community_members" do
    belongs_to(:community, Community, foreign_key: :communityId, type: :binary_id)
    belongs_to(:user, User, foreign_key: :userId, type: :binary_id)

    timestamps()
  end

  def changeset(member, params \\ %{}) do
    member
    |> cast(params, [:role, :admin, :communityId])
    |> validate_required([:role, :admin, :communityId])
  end
end
