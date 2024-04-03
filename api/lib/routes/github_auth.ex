defmodule Routes.GithubAuth do
  use Plug.Router

  alias Operations.Users
  alias Plugs.Redirect
  alias OAuth.Github

  plug(:match)
  plug(:dispatch)

  get "/" do
    conn |> Redirect.redirect(Github.authorize_url!())
  end

  get "/callback" do
    code = conn.query_params["code"]
    {:ok, access_token_secret} = Application.fetch_env(:spek, :access_token_secret)
    {:ok, refresh_token_secret} = Application.fetch_env(:spek, :refresh_token_secret)
    {:ok, web_url} = Application.fetch_env(:spek, :web_url)

    try do
      # Exchange an auth code for an access token
      client = Github.get_token!(code: code)

      # Request the user's data with the access token
      auth_user = get_user!(client)

      {_, user} = Users.github_find_or_create(auth_user, client.token.access_token)

      conn
      |> Redirect.redirect(
        web_url <>
          "/login?accessToken=" <>
          Spek.AccessToken.generate_and_sign!(
            %{"userId" => user.id},
            Joken.Signer.create("HS256", access_token_secret)
          ) <>
          "&refreshToken=" <>
          Spek.RefreshToken.generate_and_sign!(
            %{
              "userId" => user.id,
              "tokenVersion" => user.tokenVersion
            },
            Joken.Signer.create("HS256", refresh_token_secret)
          )
      )
    rescue
      e in RuntimeError ->
        Redirect.redirect(conn, web_url <> "/?error=" <> URI.encode(e.message))
    end
  end

  match _ do
    conn
    |> send_resp(404, "Not found")
  end

  defp get_user!(client) do
    %{body: user} = OAuth2.Client.get!(client, "/user")
    user
  end
end
