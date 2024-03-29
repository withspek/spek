defmodule Spek.Repo.Migrations.DmUser do
  use Ecto.Migration

  def change do
    create table(:dm_users, primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))

      add(:dm_id, references(:dms, on_delete: :delete_all, type: :uuid), null: false)
      add(:user_id, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      add(:inserted_at, :utc_datetime_usec, null: false, default: fragment("now()"))
      add(:updated_at, :utc_datetime_usec, null: false, default: fragment("now()"))
    end

    alter table(:dms) do
      remove(:read1)
      remove(:read2)
      remove(:userId1)
      remove(:userId2)

      add(:name, :text, null: false)
      add(:user_id, references(:users, on_delete: :delete_all, type: :uuid), null: false)
    end

    alter table(:dm_messages) do
      remove(:dmId)
      remove(:senderId)
      remove(:recipientId)

      add(:user_id, references(:users, on_delete: :delete_all, type: :uuid), null: false)
      add(:dm_id, references(:dms, on_delete: :delete_all, type: :uuid), null: false)
    end
  end
end
