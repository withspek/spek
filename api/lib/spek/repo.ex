defmodule Spek.Repo do
  use Ecto.Repo,
    otp_app: :spek,
    adapter: Ecto.Adapters.Postgres
end
