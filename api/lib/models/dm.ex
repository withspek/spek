defmodule Models.Dm do
  use Ecto.Schema
  import Ecto.Changeset

  alias Models.User

  @derive {Jason.Encoder,
           only: ~w(id lastMessage lastMessageTime lastMessageRead peoplePreviewList)a}
  @primary_key {:id, :binary_id, []}
  schema "dms" do
    field(:lastMessage, :string, virtual: true)
    field(:lastMessageTime, :utc_datetime_usec, virtual: true)
    field(:lastMessageRead, :boolean, virtual: true)

    embeds_many(:peoplePreviewList, User.Preview)

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(dm, attrs \\ %{}) do
    dm
    |> cast(attrs, [])
    |> cast_embed(:peoplePreviewList, required: true)
  end
end
