import Config

import_config("#{Mix.env()}.exs")

config :spek, ecto_repos: [Spek.Repo]

config :lettuce,
  folders_to_watch: ["lib", "config"]
