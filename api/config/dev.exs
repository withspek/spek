import Config

database_url =
  System.get_env("DATABASE_URL") ||
    "postgres://postgres:postgres@localhost/spek_repo"

config :spek, Spek.Repo, url: database_url

config :spek, OAuth.Gitlab,
  client_id:
    System.get_env("GITLAB_APP_ID") ||
      raise("GITLAB_APP_ID not set"),
  client_secret:
    System.get_env("GITLAB_APP_SECRET") ||
      raise("GITLAB_APP_SECRET not set"),
  redirect_uri:
    System.get_env("GITLAB_REDIRECT_URI") ||
      raise("GITLAB_REDIRECT_URI not set")

config :spek,
  web_url: "http://localhost:3000",
  api_url: "http://localhost:4001",
  env: :dev,
  access_token_secret: "ec46fc6b4a980d7edf2418627c0c9a5a7fb9d88bc925f960ae3b6d84c4034705",
  refresh_token_secret: "35a21906ea5163c939387da9971b15fddf7411448b3c27fc9619cfaa3c66b4e4"
