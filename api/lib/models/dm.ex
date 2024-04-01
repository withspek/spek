defmodule Models.Dm do
  alias Models.User
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: ~w(id peoplePreviewList)a}
  @primary_key {:id, :binary_id, []}
  schema "dms" do
    embeds_many(:peoplePreviewList, User.Preview)

    timestamps()
  end

  def changeset(dm, attrs \\ %{}) do
    dm
    |> cast(attrs, [])
    |> cast_embed(:peoplePreviewList, required: true)
  end
end
