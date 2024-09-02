defmodule Telescope.Repo.Migrations.Notifications do
  use Ecto.Migration

  def change do
    create table(:notifications, primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:message, :string, null: false)
      add(:type, :integer, default: 1)
      add(:read, :boolean, default: false)

      add(:user_id, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      timestamps(type: :utc_datetime_usec)
    end

    alter table(:subscribers) do
      add(:last_message_id, :binary_id)
    end
  end
end
