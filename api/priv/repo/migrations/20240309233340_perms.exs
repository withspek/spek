defmodule Spek.Repo.Migrations.Perms do
  use Ecto.Migration

  def change do
    alter table(:community_permissions) do
      add(:isMember, :boolean, default: false)
      add(:isBlocked, :boolean, default: false)
    end
  end
end
