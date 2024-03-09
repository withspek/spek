defmodule Spek.Repo.Migrations.Messaging do
  use Ecto.Migration

  def change do
    create table("threads", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:name, :text)

      add(:creatorId, references(:users, on_delete: :delete_all, type: :uuid), null: false)
      add(:threadId, references(:threads, on_delete: :delete_all, type: :uuid), null: false)

      add(:inserted_at, :utc_datetime_usec, null: false, default: fragment("now()"))
      add(:updated_at, :utc_datetime_usec, null: false, default: fragment("now()"))
    end

    create table("messages", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:text, :text)

      add(:userId, references(:users, on_delete: :delete_all, type: :uuid), null: false)
      add(:threadId, references(:threads, on_delete: :delete_all, type: :uuid), null: false)

      add(:inserted_at, :utc_datetime_usec, null: false, default: fragment("now()"))
      add(:updated_at, :utc_datetime_usec, null: false, default: fragment("now()"))
    end
  end
end
