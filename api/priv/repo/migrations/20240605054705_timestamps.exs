defmodule Spek.Repo.Migrations.Timestamps do
  use Ecto.Migration

  def change do
    # https://dba.stackexchange.com/questions/134385/convert-postgres-timestamp-to-timestamptz
    Enum.each(
      ["channels", "threads", "messages", "dm_messages", "communities", "users", "dm_users"],
      fn table_name ->
        execute(
          """
          ALTER TABLE #{table_name}
          ALTER inserted_at TYPE timestamptz USING inserted_at AT TIME ZONE 'UTC'
          , ALTER inserted_at SET DEFAULT now();
          """,
          ""
        )

        execute(
          """
          ALTER TABLE #{table_name}
          ALTER updated_at TYPE timestamptz USING updated_at AT TIME ZONE 'UTC'
          , ALTER updated_at SET DEFAULT now();
          """,
          ""
        )
      end
    )
  end
end
