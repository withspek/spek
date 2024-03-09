defmodule Spek.Repo.Migrations.Alter do
  use Ecto.Migration

  def change do
    alter table(:communities) do
      remove(:memberCount)
    end

    alter table(:channels) do
      remove(:memberCount)
    end
  end
end
