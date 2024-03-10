defmodule Spek.Repo.Migrations.ThreadId do
  use Ecto.Migration

  def change do
    alter table(:threads) do
      remove(:threadId)
      add(:channelId, references(:channels, on_delete: :delete_all, type: :uuid), null: false)
    end
  end
end
