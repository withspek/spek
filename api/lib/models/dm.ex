defmodule Models.Dm do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: ~w(id name)a}
  @primary_key {:id, :binary_id, []}
  schema "dms" do
    field(:name, :string)

    timestamps()
  end

  def changeset(dm, attrs) do
    dm
    |> cast(attrs, [:name])
    |> validate_required([])
  end
end
