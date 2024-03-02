defmodule Spek.Repo.Migrations.User do
  use Ecto.Migration

  def change do
    execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";", "")

    create table("users", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:username, :text, null: false)
      add(:displayName, :text, null: false)
      add(:githubId, :text)
      add(:gitlabId, :text)
      add(:githubUrl, :text)
      add(:gitlabUrl, :text)
      add(:bannerUrl, :text)
      add(:avatarUrl, :text, null: false)
      add(:email, :text)
      add(:online, :boolean, default: false)
      add(:staff, :boolean, default: false)
      add(:lastOnline, :naive_datetime)
      add(:contributions, :integer, default: 0)
      add(:tokenVersion, :integer, default: 0)

      add(:inserted_at, :utc_datetime_usec, null: false, default: fragment("now()"))
      add(:updated_at, :utc_datetime_usec, null: false, default: fragment("now()"))
    end

    create(unique_index(:users, [:githubId]))
    create(unique_index(:users, [:gitlabId]))
    create(unique_index(:users, [:username]))
  end
end
