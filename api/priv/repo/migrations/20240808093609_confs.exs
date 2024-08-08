defmodule Telescope.Repo.Migrations.Confs do
  use Ecto.Migration

  def change do
    create table(:confs, primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:name, :string, null: false)
      add(:description, :string, null: false)
      add(:voice_server_id, :string, default: "")
      add(:num_people_inside, :integer, default: 0)
      add(:is_private, :boolean, default: true)
      add(:people_preview_list, {:array, :map}, default: [])

      add(:creator_id, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      timestamps(type: :utc_datetime_usec)
    end

    create table(:conf_permissions, primary_key: false) do
      add(:user_id, references(:users, on_delete: :delete_all, type: :uuid),
        null: false,
        primary_key: true
      )

      add(:conf_id, references(:confs, on_delete: :delete_all, type: :uuid),
        null: false,
        primary_key: true
      )

      add(:is_speaker, :boolean, default: false)
      add(:is_mod, :boolean, default: false)
      add(:asked_to_speak, :boolean, default: false)

      timestamps(type: :utc_datetime_usec)
    end

    execute("drop index users_username_index;", "")
    execute("create unique index users_username_index on users(lower(username));", "")

    alter table(:users) do
      add(:current_conf_id, references(:confs, type: :uuid, on_delete: :nilify_all))
    end
  end
end
