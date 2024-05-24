defmodule Routes.Admin do
  use Plug.Router


  alias Operations.Users

  plug(:match)
  plug(Plugs.CheckAuth)
  plug(:dispatch)


  get "/" do
    users = Users.get_users()

    conn
    |> send_resp(200, Jason.encode!(users))
  end

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
