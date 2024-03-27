defmodule Routes.DevOnly do
  alias Spek.Repo
  alias Models.User
  alias Operations.Users
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/" do
    users = Users.get_users()

    conn
    |> send_resp(200, Jason.encode!(users))
  end

  get "/test-info" do
    if Mix.env() == :dev do
      username = fetch_query_params(conn).query_params["username"]
      user = Users.get_by_username(username)

      conn
      |> send_resp(
        200,
        Jason.encode!(
          Spek.Utils.TokenUtils.create_tokens(
            if is_nil(user),
              do:
                Repo.insert!(
                  %User{
                    githubId: "id:" <> username,
                    username: username,
                    avatarUrl: "https://picsum.photos/200/200/?blur",
                    bannerUrl: "https://picsum.photos/1000/300",
                    bio: "This is my bio as test user I am committed to helping to test the app",
                    displayName: String.capitalize(username),
                    email: "test@" <> username <> "test.com"
                  },
                  returning: true
                ),
              else: user
          )
        )
      )
    else
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(400, Jason.encode!(%{"error" => "no"}))
    end
  end

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
