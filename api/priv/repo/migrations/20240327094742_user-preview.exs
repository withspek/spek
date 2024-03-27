defmodule :"Elixir.Spek.Repo.Migrations.User-preview" do
  use Ecto.Migration

  def change do
    alter table(:communities) do
      add(:peoplePreviewList, {:array, :map}, default: [])
    end

    alter table(:threads) do
      add(:peoplePreviewList, {:array, :map}, default: [])
    end
  end
end
