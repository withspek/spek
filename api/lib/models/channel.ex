defmodule Models.Channel do
  alias Models.Community
  use Ecto.Schema

  @primary_key {:id, :binary_id, []}
  schema "channels" do
    field(:name, :string)
    field(:description, :string)
    field(:isPrivate, :boolean)
    field(:memberCount, :integer)
    field(:isDefault, :boolean)
    field(:archivedAt, :utc_datetime_usec)

    belongs_to(:community, Community)

    timestamps()
  end
end
