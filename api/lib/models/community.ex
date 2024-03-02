defmodule Models.Community do
  alias Models.User
  use Ecto.Schema

  @derive {Jason.Encoder, only: ~w(id name description website coverPhoto isPrivate memberCount)a}
  @primary_key {:id, :binary_id, []}
  schema "communities" do
    field(:name, :string)
    field(:description, :string)
    field(:website, :string)
    field(:coverPhoto, :string)
    field(:isPrivate, :boolean)
    field(:memberCount, :integer)

    belongs_to(:owner, User)

    timestamps()
  end
end
