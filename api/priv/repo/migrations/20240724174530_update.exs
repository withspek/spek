defmodule Telescope.Repo.Migrations.Update do
  use Ecto.Migration

  def change do
    alter table(:dm_messages) do
      remove(:dmId)
      remove(:userId)

      add(:lodge_id, references(:lodges, on_delete: :delete_all, type: :uuid), null: false)
      add(:user_id, references(:users, on_delete: :delete_all, type: :uuid), null: false)
    end

    drop(table(:dm_users))
    drop(table(:dms))
  end
end
