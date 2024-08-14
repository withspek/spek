defmodule Telescope.Schemas.Conf do
  @moduledoc """
  Conf(short for Conference) provide temporary quarters for users
  who want to hold an audio only conference.
  This schema represents a Conference
  """

  use Ecto.Schema
  import Ecto.Changeset

  alias Telescope.Schemas.Community
  alias Telescope.Schemas.User
  @timestamps_opts [type: :utc_datetime_usec]

  @derive {Jason.Encoder,
           only:
             ~w(id name description num_people_inside is_private community_id creator_id people_preview_list voice_server_id inserted_at)a}
  @primary_key {:id, :binary_id, []}
  schema "confs" do
    field(:name, :string)
    field(:description, :string, default: "")
    field(:num_people_inside, :integer)
    field(:is_private, :boolean)
    field(:voice_server_id, :string)

    belongs_to(:creator, User, foreign_key: :creator_id, type: :binary_id)
    belongs_to(:community, Community, foreign_key: :community_id, type: :binary_id)
    embeds_many(:people_preview_list, User.Preview)

    timestamps()
  end

  def insert_changeset(conf, attrs) do
    conf
    |> cast(attrs, [
      :id,
      :name,
      :creator_id,
      :community_id,
      :is_private,
      :voice_server_id,
      :description
    ])
    |> validate_required(:name, min: 2, max: 60)
    |> validate_length(:description, max: 500)
    |> unique_constraint(:creator_id)
  end

  def edit_changeset(conf, attrs) do
    conf
    |> cast(attrs, [:id, :name, :is_private, :description])
    |> validate_required(:name, min: 2, max: 60)
    |> validate_length(:description, max: 500)
  end
end
