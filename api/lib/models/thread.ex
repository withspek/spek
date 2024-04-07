defmodule Models.Thread do
  import Ecto.Changeset
  use Ecto.Schema

  alias Models.Community
  alias Models.Channel
  alias Models.User

  @derive {Jason.Encoder,
           only:
             ~w(id name creator youSubscribed channelId communityId peoplePreviewList inserted_at)a}
  @primary_key {:id, :binary_id, []}
  schema "threads" do
    field(:name, :string)
    field(:youSubscribed, :boolean, default: false, virtual: true)

    belongs_to(:creator, User, foreign_key: :creatorId, type: :binary_id)
    belongs_to(:channel, Channel, foreign_key: :channelId, type: :binary_id)
    belongs_to(:community, Community, foreign_key: :communityId, type: :binary_id)

    embeds_many(:peoplePreviewList, User.Preview)

    timestamps()
  end

  def changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:name, :creatorId, :channelId])
    |> cast_embed(:peoplePreviewList)
    |> validate_required([:channelId, :creatorId, :name, :peoplePreviewList])
  end
end
