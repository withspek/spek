import Config

import_config("#{Mix.env()}.exs")

config :spek, ecto_repos: [Telescope.Repo], pool: Ecto.Adapters.SQL.Sandbox
