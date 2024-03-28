import Config

database_url = "postgres://postgres:postgres@localhost:5432/spek_repo_test"

config :spek, Spek.Repo, url: database_url, pool: Ecto.Adapters.SQL.Sandbox

config :logger, level: :error

if System.get_env("GITHUB_ACTIONS") do
  config :app, App.Repo,
    username: "postgres",
    password: "postgres"
end

config :spek,
  web_url: System.get_env("WEB_URL") || "http://localhost:3000",
  api_url: System.get_env("API_URL") || "http://localhost:4001",
  access_token_secret: "thisistheaccesstokenfortest",
  refresh_token_secret: "thisistherefreshtokenfortest"

config :spek, websocket_auth_timeout: 50
