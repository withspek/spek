defmodule Models.Community do
  use Ecto.Schema
  import Ecto.Changeset

  alias Models.User

  defmodule Permissions do
    use Ecto.Schema

    @derive {Jason.Encoder, only: ~w(isAdmin isMember isMod isBlocked)a}
    @primary_key false
    embedded_schema do
      field(:isAdmin, :boolean)
      field(:isMember, :boolean)
      field(:isMod, :boolean)
      field(:isBlocked, :boolean)
    end
  end

  defmodule Preview do
    use Ecto.Schema

    @derive {Jason.Encoder, only: ~w(id name description slug)a}
    @primary_key false
    embedded_schema do
      field(:id, :binary_id)
      field(:name, :string)
      field(:description, :string)
      field(:slug, :string)
    end
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

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(community, params \\ %{}) do
    community
    |> cast(params, [:name, :slug, :description, :isPrivate, :ownerId])
    |> validate_required([:name, :slug, :description, :ownerId])
    |> unique_constraint(:name)
  end

  def edit_changeset(community, params \\ %{}) do
    community
    |> cast(params, [:name, :description])
    |> validate_required([:name, :description])
    |> unique_constraint(:name)
  end
end
