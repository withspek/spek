defmodule Spek.Repo.Migrations.Slugs do
  use Ecto.Migration

  def change do
    alter table(:communities) do
      add(:slug, :text)
    end

    alter table(:channels) do
      add(:slug, :text)
    end

    create(unique_index(:communities, [:slug]))
    create(index(:channels, [:slug]))

    drop(unique_index(:channels, [:name]))
  end
end
