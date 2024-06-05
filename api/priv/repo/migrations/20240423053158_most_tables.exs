defmodule Spek.Repo.Migrations.MostTables do
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
      add(:bio, :text, default: "")

      timestamps(type: :utc_datetime_usec)
    end

    create(unique_index(:users, [:githubId]))
    create(unique_index(:users, [:gitlabId]))
    create(unique_index(:users, [:username]))

    create table("communities", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:name, :text)
      add(:slug, :text)
      add(:description, :text)
      add(:isPrivate, :boolean, default: false)
      add(:memberCount, :integer, default: 1)
      add(:coverPhoto, :text)
      add(:ownerId, references(:users, on_delete: :delete_all, type: :uuid), null: false)
      add(:peoplePreviewList, {:array, :map}, default: [])

      timestamps(type: :utc_datetime_usec)
    end

    # CHANNELS
    create table("channels", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:name, :text)
      add(:slug, :text)
      add(:description, :text)
      add(:isPrivate, :boolean, default: false)
      add(:isDefault, :boolean, default: false)
      add(:memberCount, :integer, default: 1)

      add(:communityId, references(:communities, on_delete: :delete_all, type: :uuid),
        null: false
      )

      add(:archivedAt, :utc_datetime_usec, null: true)
      timestamps(type: :utc_datetime_usec)
    end

    create table("community_members", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:userId, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      add(:communityId, references(:communities, on_delete: :delete_all, type: :uuid),
        null: false
      )

      timestamps(type: :utc_datetime_usec)
    end

    create table("channel_members", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:userId, references(:users, on_delete: :delete_all, type: :uuid), null: false)
      add(:channelId, references(:channels, on_delete: :delete_all, type: :uuid), null: false)
      timestamps(type: :utc_datetime_usec)
    end

    create table("community_permissions", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:isMod, :boolean, default: false)
      add(:isAdmin, :boolean, default: false)
      add(:userId, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      add(:communityId, references(:communities, on_delete: :delete_all, type: :uuid),
        null: false
      )

      add(:isMember, :boolean, default: false)
      add(:isBlocked, :boolean, default: false)

      timestamps(type: :utc_datetime_usec)
    end

    create table("threads", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:name, :text)

      add(:creatorId, references(:users, on_delete: :delete_all, type: :uuid), null: false)
      add(:channelId, references(:channels, on_delete: :delete_all, type: :uuid), null: false)

      add(:communityId, references(:communities, on_delete: :delete_all, type: :uuid),
        null: false
      )

      add(:peoplePreviewList, {:array, :map}, default: [])

      timestamps(type: :utc_datetime_usec)
    end

    create table("messages", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:text, :text)

      add(:userId, references(:users, on_delete: :delete_all, type: :uuid), null: false)
      add(:threadId, references(:threads, on_delete: :delete_all, type: :uuid), null: false)

      timestamps(type: :utc_datetime_usec)
    end

    create(index(:messages, [:text]))
    create(index(:threads, [:name]))
    create(unique_index(:communities, [:name]))
    create(index(:channels, [:name]))
    create(unique_index(:communities, [:slug]))
    create(index(:channels, [:slug]))

    create table("dms", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:peoplePreviewList, {:array, :map}, default: [])

      timestamps(type: :utc_datetime_usec)
    end

    create table("dm_messages", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))

      add(:text, :text)
      add(:userId, references(:users, on_delete: :delete_all, type: :uuid), null: false)
      add(:dmId, references(:dms, on_delete: :delete_all, type: :uuid), null: false)

      timestamps(type: :utc_datetime_usec)
    end

    create table(:dm_users, primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:dmId, references(:dms, on_delete: :delete_all, type: :uuid), null: false)
      add(:userId, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      timestamps(type: :utc_datetime_usec)
    end

    create table("subscribers", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))

      add(:threadId, references(:threads, on_delete: :delete_all, type: :uuid), null: false)
      add(:subscriberId, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      timestamps(type: :utc_datetime_usec)
    end
  end
end
