import Config

config :spek, Spek.Repo,
  database: "spek_repo",
  username: "postgres",
  password: "postgres",
  hostname: "localhost"

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
