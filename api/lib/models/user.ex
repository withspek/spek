defmodule Models.User do
  use Ecto.Schema

  defmodule UserPreview do
    @derive {Jason.Encoder, only: ~w(id username displayName avatarUrl online bio)a}
    defstruct [:id, :username, :displayName, :avatarUrl, :online, :bio]
  end

  @derive {Jason.Encoder, only: ~w(username displayName bio bannerUrl avatarUrl
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

    timestamps()
  end
end
