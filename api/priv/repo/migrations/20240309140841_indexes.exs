defmodule Spek.Repo.Migrations.Indexes do
  use Ecto.Migration

  def change do
    create(index(:messages, [:text]))
    create(index(:threads, [:name]))
    create(index(:communities, [:name]))
    create(index(:channels, [:name]))
  end
end
