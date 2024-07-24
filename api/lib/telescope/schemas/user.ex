defmodule Telescope.Schemas.User do
  use Ecto.Schema

  import Ecto.Changeset

  defmodule Preview do
    use Ecto.Schema

    @derive {Jason.Encoder, only: ~w(id displayName bio avatarUrl)a}
    @primary_key false
    embedded_schema do
      field(:id, :binary_id)

      field(:displayName, :string)
      field(:bio, :string)
      field(:avatarUrl, :string)
    end
  end

  @derive {Jason.Encoder, only: ~w(id username displayName bio bannerUrl avatarUrl
             email githubUrl online lastOnline contributions inserted_at updated_at gitlabUrl)a}

  @primary_key {:id, :binary_id, []}
  schema "users" do
    field(:username, :string)
    field(:displayName, :string)
    field(:bio, :string)
    field(:bannerUrl, :string)
    field(:avatarUrl, :string)
    field(:email, :string)
    field(:gitlabUrl, :string)
    field(:githubUrl, :string)
    field(:gitlabId, :string)
    field(:githubId, :string)
    field(:contributions, :integer)
    field(:tokenVersion, :integer)
    field(:staff, :boolean)
    field(:online, :boolean, default: false)
    field(:lastOnline, :utc_datetime_usec)

    timestamps(type: :utc_datetime_usec)
  end

  def edit_changeset(user, attrs) do
    user
    |> cast(attrs, [
      :id,
      :username,
      :bio,
      :displayName,
      :avatarUrl,
      :bannerUrl
    ])
    |> validate_required([:username, :displayName, :avatarUrl])
    |> update_change(:displayName, &String.trim/1)
    |> validate_length(:bio, min: 0, max: 160)
    |> validate_length(:displayName, min: 2, max: 50)
    |> validate_format(:username, ~r/^[\w\.]{4,15}$/)
    |> unique_constraint(:username)
  end
end
