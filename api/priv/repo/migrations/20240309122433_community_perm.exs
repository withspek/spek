defmodule Spek.Repo.Migrations.CommunityPerm do
  use Ecto.Migration

  def change do
    create table("community_members", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:userId, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      add(:communityId, references(:communities, on_delete: :delete_all, type: :uuid),
        null: false
      )

      add(:inserted_at, :utc_datetime_usec, null: false, default: fragment("now()"))
      add(:updated_at, :utc_datetime_usec, null: false, default: fragment("now()"))
    end

    create table("channel_members", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:userId, references(:users, on_delete: :delete_all, type: :uuid), null: false)
      add(:channelId, references(:channels, on_delete: :delete_all, type: :uuid), null: false)
      add(:inserted_at, :utc_datetime_usec, null: false, default: fragment("now()"))
      add(:updated_at, :utc_datetime_usec, null: false, default: fragment("now()"))
    end

    create table("community_permissions", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:isMod, :boolean, default: false)
      add(:isAdmin, :boolean, default: false)
      add(:userId, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      add(:communityId, references(:communities, on_delete: :delete_all, type: :uuid),
        null: false
      )

      add(:inserted_at, :utc_datetime_usec, null: false, default: fragment("now()"))
      add(:updated_at, :utc_datetime_usec, null: false, default: fragment("now()"))
    end
  end
end
