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

  %URI{host: database_host} = URI.parse(database_url)

  # Location of root certificates to verify database SSL connection.
  # For example: /opt/homebrew/etc/openssl@3/cert.pem
  database_ca_cert_filepath =
    System.get_env("DATABASE_CA_CERT_FILEPATH") || "/etc/secrets/cakey.pem"

  maybe_ipv6 = if System.get_env("ECTO_IPV6"), do: [:inet6], else: []

  config :spek, Telescope.Repo,
    url: database_url,
    # Our production database requires SSL to be enabled to connect. This enables verifying the Postgres server has a valid certificate.
    ssl: true,
    ssl_opts: [
      verify: :verify_peer,
      cacertfile: database_ca_cert_filepath,
      # see https://pspdfkit.com/blog/2022/using-ssl-postgresql-connections-elixir/
      server_name_indication: to_charlist(database_host),
      customize_hostname_check: [
        # Our hosting provider uses a wildcard certificate. By default, Erlang does not support wildcard certificates. This function supports validating wildcard hosts
        match_fun: :public_key.pkix_verify_hostname_match_fun(:https)
      ]
    ],
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
    socket_options: maybe_ipv6

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
