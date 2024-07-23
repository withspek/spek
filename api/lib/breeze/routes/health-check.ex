defmodule Breeze.Routes.HealthCheck do
  use Plug.Router

  alias Breeze.Plugs

  plug(Plugs.Cors)
  plug(:match)
  plug(:dispatch)

  get "/" do
    send_resp(conn, "ok", 200)
  end

  match _ do
    conn
    |> send_resp(404, "not found")
  end
end
