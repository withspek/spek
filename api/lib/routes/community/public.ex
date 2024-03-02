defmodule Routes.Community.Public do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/" do
    conn
    |> send_resp(200, "Protected")
  end

  match _ do
    send_resp(conn, 404, "Not found")
  end
end
