defmodule Models.ChannelMember do
  alias Models.User
  alias Models.Community
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: ~w(id userId communityId)a}
  @primary_key {:id, :binary_id, []}
  schema "channel_members" do
    belongs_to(:community, Community, foreign_key: :communityId, type: :binary_id)
    belongs_to(:user, User, foreign_key: :userId, type: :binary_id)

    timestamps()
  end

  def changeset(member, params \\ %{}) do
    member
    |> cast(params, [:communityId, :userId])
    |> validate_required([:communityId, :userId])
  end
end
