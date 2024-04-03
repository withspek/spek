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
             ~w(id name description coverPhoto isPrivate memberCount membersOnlineCount peoplePreviewList)a}

  @primary_key {:id, :binary_id, []}
  schema "communities" do
    field(:name, :string)
    field(:description, :string)
    field(:memberCount, :integer, default: 1)
    field(:membersOnlineCount, :integer, virtual: true)
    field(:coverPhoto, :string)
    field(:isPrivate, :boolean)

    belongs_to(:owner, User, foreign_key: :ownerId, type: :binary_id)

    embeds_many(:peoplePreviewList, User.Preview)

    timestamps()
  end

  def changeset(community, params \\ %{}) do
    community
    |> cast(params, [:name, :description, :isPrivate, :ownerId])
    |> validate_required([:name, :description, :ownerId])
  end
end
