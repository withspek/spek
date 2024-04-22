defmodule Spek.Repo.Migrations.UniqueIndexes do
  use Ecto.Migration

  def change do
    drop(index(:communities, :name))
    drop(index(:channels, :name))

    create(unique_index(:communities, [:name]))
    create(unique_index(:channels, [:name]))
  end
end
