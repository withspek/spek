defmodule Spek.Repo.Migrations.General do
  use Ecto.Migration

  def change do
    create table("communities", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:name, :text)
      add(:description, :text)
      add(:isPrivate, :boolean, default: false)
      add(:memberCount, :integer, default: 0)
      add(:coverPhoto, :text)
      add(:ownerId, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      add(:inserted_at, :utc_datetime_usec, null: false, default: fragment("now()"))
      add(:updated_at, :utc_datetime_usec, null: false, default: fragment("now()"))
    end

    create table("channels", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:name, :text)
      add(:description, :text)
      add(:isPrivate, :boolean, default: false)
      add(:isDefault, :boolean, default: false)
      add(:memberCount, :integer, default: 0)

      add(:communityId, references(:communities, on_delete: :delete_all, type: :uuid),
        null: false
      )

      add(:archivedAt, :utc_datetime_usec, null: true)
      add(:inserted_at, :utc_datetime_usec, null: false, default: fragment("now()"))
      add(:updated_at, :utc_datetime_usec, null: false, default: fragment("now()"))
    end

    alter table(:users) do
      add(:bio, :text, default: "")
    end
  end
end
