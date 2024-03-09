defmodule Models.Community do
  use Ecto.Schema
  import Ecto.Changeset

  alias Models.User

  @derive {Jason.Encoder, only: ~w(id name description coverPhoto isPrivate memberCount)a}

  @primary_key {:id, :binary_id, []}
  schema "communities" do
    field(:name, :string)
    field(:description, :string)
    field(:memberCount, :integer, default: 1)
    field(:coverPhoto, :string)
    field(:isPrivate, :boolean)

    belongs_to(:owner, User, foreign_key: :ownerId, type: :binary_id)

    timestamps()
  end

  def changeset(community, params \\ %{}) do
    community
    |> cast(params, [:name, :description, :isPrivate, :ownerId])
    |> validate_required([:name, :description, :ownerId])
  end
end
