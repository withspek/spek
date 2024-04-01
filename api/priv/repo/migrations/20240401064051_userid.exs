defmodule Spek.Repo.Migrations.Userid do
  use Ecto.Migration

  def change do
    alter table(:dms) do
      remove(:userId)
    end
  end
end
