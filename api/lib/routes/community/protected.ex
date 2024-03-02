defmodule Routes.Community.Protected do
  use Plug.Router

  alias Operations.Communities

  plug(Plugs.CheckAuth)
  plug(:match)
  plug(:dispatch)

  get "/" do
    conn
    |> send_resp(200, "Protected")
  end

  post "/create" do
    body = conn.body_params
    user = conn.user

    {:ok, community} = Communities.create_community(body)

    conn
    |> send_resp(200, Jason.encode!(community))
  end

  match _ do
    send_resp(conn, 404, "Not found")
  end
end
