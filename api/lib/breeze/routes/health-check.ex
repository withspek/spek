defmodule Breeze.Routes.HealthCheck do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/" do
    resp = %{success: true}

    conn
    |> send_resp(200, Jason.encode!(resp))
  end

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
