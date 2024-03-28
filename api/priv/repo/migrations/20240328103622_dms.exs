defmodule Spek.Repo.Migrations.Dms do
  use Ecto.Migration

  def change do
    create table("dms", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))

      add(:read1, :boolean, default: false)
      add(:read2, :boolean, default: false)

      add(:userId1, references(:users, on_delete: :delete_all, type: :uuid), null: false)
      add(:userId2, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      add(:inserted_at, :utc_datetime_usec, null: false, default: fragment("now()"))
      add(:updated_at, :utc_datetime_usec, null: false, default: fragment("now()"))
    end

    create table("dm_messages", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))

      add(:text, :text)

      add(:dmId, references(:dms, on_delete: :delete_all, type: :uuid), null: false)
      add(:recipientId, references(:users, on_delete: :delete_all, type: :uuid), null: false)
      add(:senderId, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      add(:inserted_at, :utc_datetime_usec, null: false, default: fragment("now()"))
      add(:updated_at, :utc_datetime_usec, null: false, default: fragment("now()"))
    end
  end
end
