defmodule Breeze.Routes.V1.Metrics do
  use Plug.Router

  alias Telescope.Users
  alias Telescope.Communities

  plug(:match)
  plug(Breeze.Plugs.CheckAuth)
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
