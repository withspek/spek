defmodule Breeze.OAuth.Gitlab do
  use OAuth2.Strategy

  def config do
    [
      strategy: __MODULE__,
      site: "https://gitlab.com/api/v4",
      authorize_url: " https://gitlab.com/oauth/authorize",
      token_url: "https://gitlab.com/oauth/token"
    ]
  end

  def client do
    Application.get_env(:spek, __MODULE__)
    |> Keyword.merge(config())
    |> OAuth2.Client.new()
    |> OAuth2.Client.put_serializer("application/json", Jason)
  end

  def authorize_url! do
    OAuth2.Client.authorize_url!(client(), scope: "read_user")
  end

  def get_token!(params \\ [], headers \\ [], opts \\ []) do
    OAuth2.Client.get_token!(client(), params, headers, opts)
  end

  # Strategy callbacks

  def authorize_url(client, params) do
    OAuth2.Strategy.AuthCode.authorize_url(client, params)
  end

  def get_token(client, params, headers) do
    client
    |> put_header("accept", "application/json")
    |> OAuth2.Strategy.AuthCode.get_token(params, headers)
  end
end
