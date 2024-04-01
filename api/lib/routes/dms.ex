defmodule Routes.Dms do
  use Plug.Router

  alias Operations.Dms

  plug(Plugs.CheckAuth, %{shouldThrow: false})
  plug(:match)
  plug(:dispatch)

  get "/" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user_id = conn.assigns.user_id

      dms = Dms.get_user_dms(user_id)

      conn
      |> send_resp(200, Jason.encode!(dms))
    else
      conn
      |> send_resp(401, Jason.encode!(%{error: "UNAUTHORIZED"}))
    end
  end

  post "/create" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    case has_user_id do
      true ->
        user_ids = conn.body_params["user_ids"]

        # TODO: Support more 2 people dm
        dm = Dms.get_dm_by_user_ids(Enum.at(user_ids, 0), Enum.at(user_ids, 1))

        if is_nil(dm) do
          dm = Dms.create_dm(user_ids)

          conn
          |> send_resp(200, Jason.encode!(dm))
        else
          conn
          |> send_resp(200, Jason.encode!(dm))
        end

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
