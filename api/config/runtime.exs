import Config

# config/runtime.exs is executed for all environments, including
# during releases. It is executed after compilation and before the
# system starts, so it is typically used to load production configuration
# and secrets from environment variables or elsewhere. Do not define
# any compile-time configuration in here, as it won't be applied.
# The block below contains prod specific runtime configuration.

if config_env() == :prod do
  database_url =
    System.get_env("DATABASE_URL") ||
      raise """
      Environment variable DATABASE_URL is missing.
      For example: ecto://USER:PASSWORD@HOST:PORT/DATABASE
      """

  config :spek, Telescope.Repo,
    url: database_url,
    socket_options: [:inet],
    ssl_opts: [verify: :verify_none],
    ssl: true

  config :spek, Breeze.OAuth.Gitlab,
    client_id:
      System.get_env("GITLAB_APP_ID") ||
        raise("""
        environment variable GITLAB_APP_ID not set.
        Create an oauth application on gitlab to get one
        """),
    client_secret:
      System.get_env("GITLAB_APP_SECRET") ||
        raise("""
        environment variable GITLAB_APP_SECRET not set.
        Create an oauth application on gitlab to get one
        """),
    redirect_uri:
      System.get_env("GITLAB_REDIRECT_URI") ||
        raise("""
        environment variable GITLAB_REDIRECT_URI not set.
        set it your os environment
        """)

  config :spek, Breeze.OAuth.Github,
    client_id:
      System.get_env("GITHUB_CLIENT_ID") ||
        raise("""
        environment variable GITHUB_APP_ID not set.
        Create an oauth application on gitlab to get one
        """),
    client_secret:
      System.get_env("GITHUB_CLIENT_SECRET") ||
        raise("""
        environment variable GITLAB_APP_SECRET not set.
        Create an oauth application on gitlab to get one
        """),
    redirect_uri:
      System.get_env("GITHUB_REDIRECT_URI") ||
        raise("""
        environment variable GITHUB_REDIRECT_URI not set.
        set it your os environment
        """)

  config :spek,
    web_url: System.get_env("WEB_URL") || "https://spek.app",
    api_url: System.get_env("API_URL") || "https://api.spek.app",
    access_token_secret:
      System.get_env("ACCESS_TOKEN_SECRET") ||
        raise("""
        environment variable ACCESS_TOKEN_SECRET not set.
        type some random characters to create one
        """),
    refresh_token_secret:
      System.get_env("REFRESH_TOKEN_SECRET") ||
        raise("""
        environment variable REFRESH_TOKEN_SECRET not set.
        type some random characters to create one
        """)
end
