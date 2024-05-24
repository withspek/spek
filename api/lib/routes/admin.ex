defmodule Routes.Admin do
  use Plug.Router

  alias Operations.Users
  alias Operations.Communities

  plug(:match)
  plug(Plugs.CheckAuth)
  plug(:dispatch)

  get "/users" do
    users = Users.get_users()

    conn
    |> send_resp(200, Jason.encode!(users))
  end

  get "/communities" do
    communities = Communities.get_top_communities(100)

    conn
    |> send_resp(200, Jason.encode!(communities))
  end

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
