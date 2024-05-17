import Config

import_config("#{Mix.env()}.exs")

config :spek, ecto_repos: [Spek.Repo], pool: Ecto.Adapters.SQL.Sandbox
