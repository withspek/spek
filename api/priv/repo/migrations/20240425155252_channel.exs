defmodule Spek.Repo.Migrations.Channel do
  use Ecto.Migration

  def change do
    alter table("channels") do
      add(:creatorId, references(:users, on_delete: :delete_all, type: :uuid), null: true)
    end
  end
end
