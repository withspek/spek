defmodule Telescope.Repo.Migrations.CommId do
  use Ecto.Migration

  def change do
    alter table(:confs) do
      add(:community_id, references(:communities, on_delete: :delete_all, type: :uuid),
        null: false
      )
    end
  end
end
