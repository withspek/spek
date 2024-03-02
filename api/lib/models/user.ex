defmodule Models.User do
  use Ecto.Schema

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

    timestamps()
  end
end
