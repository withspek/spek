import Config

import_config("#{Mix.env()}.exs")

config :spek, ecto_repos: [Telescope.Repo], pool: Ecto.Adapters.SQL.Sandbox
config :spek, max_conf_size: 1000

config :logger, backends: [LoggerBackends.Console]
config :logger, LoggerBackends.Console, []
