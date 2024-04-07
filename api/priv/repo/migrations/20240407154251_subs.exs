defmodule Spek.Repo.Migrations.Subs do
  use Ecto.Migration

  def change do
    create table("subscribers", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))

      add(:threadId, references(:threads, on_delete: :delete_all, type: :uuid), null: false)
      add(:subscriberId, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      add(:inserted_at, :utc_datetime_usec, null: false, default: fragment("now()"))
      add(:updated_at, :utc_datetime_usec, null: false, default: fragment("now()"))
    end
  end
end
