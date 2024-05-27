defmodule Models.Channel do
  alias Models.User
  alias Models.Community
  use Ecto.Schema
  import Ecto.Changeset

  defmodule Preview do
    use Ecto.Schema

    @derive {Jason.Encoder, only: ~w(id name)a}
    @primary_key false
    embedded_schema do
      field(:id, :binary_id)
      field(:name, :string)
    end
  end

  @derive {Jason.Encoder,
           only:
             ~w(id name slug description community isPrivate isDefault isMember isAdmin memberCount)a}
  @primary_key {:id, :binary_id, []}
  schema "channels" do
    field(:name, :string)
    field(:slug, :string)
    field(:description, :string)
    field(:isPrivate, :boolean)
    field(:isDefault, :boolean)
    field(:isMember, :boolean, virtual: true)
    field(:isAdmin, :boolean, virtual: true)
    field(:memberCount, :integer, default: 1)
    field(:archivedAt, :utc_datetime_usec)

    belongs_to(:community, Community, foreign_key: :communityId, type: :binary_id)
    belongs_to(:user, User, foreign_key: :creatorId, type: :binary_id)

    timestamps()
  end

  def changeset(channel, params \\ %{}) do
    channel
    |> cast(params, [:name, :slug, :description, :isPrivate, :isDefault])
    |> validate_required([:name, :slug, :description])
    |> unique_constraint(:name)
  end

  def edit_changeset(channel, params \\ %{}) do
    channel
    |> cast(params, [:name, :description])
    |> validate_required([:name, :description])
  end
end
