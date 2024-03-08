defmodule Models.Channel do
  alias Models.Community
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder,
           only: ~w(id name description communityId isPrivate isDefault memberCount)a}
  @primary_key {:id, :binary_id, []}
  schema "channels" do
    field(:name, :string)
    field(:description, :string)
    field(:isPrivate, :boolean)
    field(:memberCount, :integer)
    field(:isDefault, :boolean)
    field(:archivedAt, :utc_datetime_usec)

    belongs_to(:community, Community, foreign_key: :communityId, type: :binary_id)

    timestamps()
  end

  def changeset(channel, params \\ %{}) do
    channel
    |> cast(params, [:name, :description, :isPrivate, :isDefault])
    |> validate_required([:name, :description])
    |> unique_constraint(:name)
  end
end
