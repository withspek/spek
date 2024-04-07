defmodule Models.Subscriber do
  import Ecto.Changeset
  use Ecto.Schema

  alias Models.User
  alias Models.Thread

  @primary_key {:id, :binary_id, []}
  schema "subscribers" do
    # the thread you are subscribed to
    belongs_to(:thread, Thread, foreign_key: :threadId, type: :binary_id)
    # the person who is subscribed
    belongs_to(:subscriber, User, foreign_key: :subscriberId, type: :binary_id)

    timestamps()
  end

  def changeset(sub, attrs \\ %{}) do
    sub
    |> cast(attrs, [:threadId, :subscriberId])
    |> validate_required([:threadId, :subscriberId])
  end
end
