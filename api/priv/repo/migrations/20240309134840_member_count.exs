defmodule Spek.Repo.Migrations.MemberCount do
  use Ecto.Migration

  def change do
    alter table(:communities) do
      add(:memberCount, :integer, default: 1)
    end

    alter table(:channels) do
      add(:memberCount, :integer, default: 1)
    end
  end
end
