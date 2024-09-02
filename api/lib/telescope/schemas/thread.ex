defmodule Telescope.Schemas.Thread do
  import Ecto.Changeset
  use Ecto.Schema

  alias Telescope.Schemas.Community
  alias Telescope.Schemas.Channel
  alias Telescope.Schemas.User

  defmodule Preview do
    use Ecto.Schema

    @derive {Jason.Encoder, only: ~w(id name message_count community peoplePreviewList)a}
    @primary_key false
    embedded_schema do
      field(:id, :binary_id)

      field(:name, :string)
      field(:message_count, :integer, virtual: true)
      belongs_to(:community, Community)
      embeds_many(:peoplePreviewList, User.Preview)
    end
  end

  @primary_key {:id, :binary_id, []}
  schema "threads" do
    field(:name, :string)
    field(:you_subscribed, :boolean, default: false, virtual: true)
    field(:unread_messages_count, :integer, default: 0, virtual: true)

    belongs_to(:creator, User, foreign_key: :creatorId, type: :binary_id)
    belongs_to(:channel, Channel, foreign_key: :channelId, type: :binary_id)
    belongs_to(:community, Community, foreign_key: :communityId, type: :binary_id)

    embeds_many(:peoplePreviewList, User.Preview)

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:name, :creatorId, :channelId])
    |> cast_embed(:peoplePreviewList)
    |> validate_required([:channelId, :creatorId, :name, :peoplePreviewList])
  end

  def edit_changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:name])
    |> validate_required([:name])
  end

  defimpl Jason.Encoder do
    @fields ~w(
      id name creator channelId communityId you_subscribed
      peoplePreviewList inserted_at updated_at
    )a

    defp transform_creator(fields = %{creator: %Ecto.Association.NotLoaded{}}) do
      Map.delete(fields, :creator)
    end

    defp transform_creator(fields) do
      fields
    end

    def encode(user, opts) do
      user
      |> Map.take(@fields)
      |> transform_creator()
      |> Jason.Encoder.encode(opts)
    end
  end
end
