defmodule Routes.GitlabAuth do
  use Plug.Router

  alias Plugs.Redirect
  alias OAuth.Gitlab

  plug(:match)
  plug(:dispatch)

  get "/" do
    conn |> Redirect.redirect(Gitlab.authorize_url!())
  end

  get "/callback" do
    code = conn.query_params["code"]

    # Exchange an auth code for an access token
    client = Gitlab.get_token!(code: code)

    # Request the user's data with the access token
    user = get_user!(client)

    conn
    |> send_resp(200, Jason.encode!(%{"user" => user}))
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
