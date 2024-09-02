defmodule Telescope.Schemas.Notification do
  @moduledoc """
    Notification type can be 1, 2, 3,...
    1 --> Message request notifications
    2 --> New room invite notifications
    3 --> Community invite notifications

  """
  use Ecto.Schema
  import Ecto.Changeset

  alias Telescope.Schemas.User

  @primary_key {:id, :binary_id, []}
  @timestamps_opts [:utc_datetime_usec]
  schema "notifications" do
    field(:type, :integer, default: 1)
    field(:message, :string)
    field(:read, :boolean, default: false)

    belongs_to(:user, User, foreign_key: :user_id, type: :binary_id)

    timestamps()
  end

  def changest(notification, params \\ %{}) do
    notification
    |> cast(params, [:type, :message, :read])
    |> validate_required([:type, :message])
  end

  def edit_changeset(notification, params \\ %{}) do
    notification
    |> cast(params, [:read])
    |> validate_required(:read)
  end
end
