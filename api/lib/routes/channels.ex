defmodule Routes.Channels do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/" do
    conn
    |> send_resp(200, Jason.encode!(%{hello: "Hello world"}))
  end

  match _ do
    conn
    |> send_resp(200, "Not found")
  end
end
