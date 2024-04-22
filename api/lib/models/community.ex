defmodule Models.Community do
  use Ecto.Schema
  import Ecto.Changeset

  alias Models.User

  defmodule CommunityPreview do
    @derive {Jason.Encoder, only: ~w(id name description createdAt peoplePreviewList)a}
    defstruct [:id, :name, :description, :createdAt, :peoplePreviewList]
  end

  @derive {Jason.Encoder,
           only:
             ~w(id name slug description coverPhoto isAdmin isMod isMember isBlocked isPrivate memberCount membersOnlineCount peoplePreviewList)a}

  @primary_key {:id, :binary_id, []}
  schema "communities" do
    field(:name, :string)
    field(:slug, :string)
    field(:description, :string)
    field(:memberCount, :integer, default: 1)
    field(:membersOnlineCount, :integer, virtual: true)
    field(:coverPhoto, :string)
    field(:isPrivate, :boolean)
    field(:isAdmin, :boolean, default: false, virtual: true)
    field(:isMember, :boolean, default: false, virtual: true)
    field(:isBlocked, :boolean, default: false, virtual: true)
    field(:isMod, :boolean, default: false, virtual: true)

    belongs_to(:owner, User, foreign_key: :ownerId, type: :binary_id)

    embeds_many(:peoplePreviewList, User.Preview)

    timestamps()
  end

  def changeset(community, params \\ %{}) do
    community
    |> cast(params, [:name, :slug, :description, :isPrivate, :ownerId])
    |> validate_required([:name, :slug, :description, :ownerId])
    |> unique_constraint(:name)
  end
end
