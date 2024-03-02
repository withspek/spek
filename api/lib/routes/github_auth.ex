defmodule Routes.GithubAuth do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/" do
    IO.puts("Hello world")
    send_resp(conn, 200, "Hello world")
  end

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
