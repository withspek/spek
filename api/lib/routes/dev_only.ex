defmodule Routes.DevOnly do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/" do
    conn
    |> send_resp(200, Poison.encode!(%{"name" => "Irere", "age" => 16}))
  end

  get "/create" do
    conn
    |> send_resp(301, "Hello world")
  end

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
