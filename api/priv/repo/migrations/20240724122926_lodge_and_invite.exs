defmodule Telescope.Repo.Migrations.LodgeAndInvite do
  use Ecto.Migration

  def change do
    create table("lodges", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:type, :integer, default: 1)
      add(:member_count, :integer, default: 0)
      add(:user_limit, :integer, default: 100)
      add(:nsfw, :boolean, default: false)
      add(:last_message_id, :binary_id)
      add(:recipients, {:array, :map}, default: [])
      add(:owner_id, references(:users, on_delete: :delete_all, type: :uuid), null: false)

      timestamps(type: :utc_datetime_usec)
    end

    create table("invites", primary_key: false) do
      add(:id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()"))
      add(:type, :integer, default: 2)
      add(:code, :binary_id)
      add(:read, :boolean, default: false)
      add(:expires_at, :utc_datetime_usec)
      add(:inviter_id, references(:users, on_delete: :delete_all, type: :uuid), null: false)
      add(:lodge_id, references(:lodges, on_delete: :delete_all, type: :uuid))
      add(:community_id, references(:communities, on_delete: :delete_all, type: :uuid))

      timestamps(type: :utc_datetime_usec)
    end
  end
end
