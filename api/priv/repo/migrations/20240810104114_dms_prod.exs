defmodule Telescope.Repo.Migrations.DmsProd do
  use Ecto.Migration

  def change do
    drop_if_exists(constraint(:dm_messages, "dm_messages_user_id_fkey"))
    drop_if_exists(constraint(:dm_messages, "dm_messages_lodge_id_fkey"))

    alter table(:dm_messages) do
      remove_if_exists(:dmId, :uuid)
      remove_if_exists(:userId, :uuid)

      add_if_not_exists(:user_id, references(:users, on_delete: :delete_all, type: :uuid),
        null: false
      )

      add_if_not_exists(:lodge_id, references(:lodges, on_delete: :delete_all, type: :uuid),
        null: false
      )
    end

    execute("drop table if exists dm_users;", "")
  end
end
