defmodule Routes.Dms do
  use Plug.Router

  alias Operations.Dms

  plug(:match)
  plug(:dispatch)

  get "/" do
    conn
    |> send_resp(200, "found")
  end

  post "/create" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    case has_user_id do
      true ->
        user_id_1 = conn.body_params["userId1"]
        user_id_2 = conn.body_params["userId2"]

        dm = Dms.create_dm(user_id_1, user_id_2)

        conn
        |> send_resp(200, Jason.encode!(dm))

      false ->
        conn
        |> send_resp(401, Jason.encode!(%{error: "UNAUTHORIZED"}))
    end
  end

  match _ do
    conn
    |> send_resp(404, "not found")
  end
end
