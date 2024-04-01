defmodule Routes.GitlabAuth do
  use Plug.Router

  alias Plugs.Redirect
  alias OAuth.Gitlab
  alias Operations.Mutations.Users

  plug(:match)
  plug(:dispatch)

  get "/" do
    conn |> Redirect.redirect(Gitlab.authorize_url!())
  end

  get "/callback" do
    code = conn.query_params["code"]
    {:ok, access_token_secret} = Application.fetch_env(:spek, :access_token_secret)
    {:ok, refresh_token_secret} = Application.fetch_env(:spek, :refresh_token_secret)

    try do
      # Exchange an auth code for an access token
      client = Gitlab.get_token!(code: code)

      # Request the user's data with the access token
      auth_user = get_user!(client)

      {_, user} = Users.gitlab_find_or_create(auth_user)

      conn
      |> Redirect.redirect(
        "http://localhost:3000" <>
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
        Redirect.redirect(conn, "http://localhost:3000" <> "/?error=" <> URI.encode(e.message))
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
