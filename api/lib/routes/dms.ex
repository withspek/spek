defmodule Routes.Dms do
  use Plug.Router

  alias Operations.Dms
  alias Spek.DmSession

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

  get "/:id" do
    dm_id = conn.params["id"]

    case Ecto.UUID.cast(dm_id) do
      {:ok, uuid} ->
        dm = Dms.get_dm_by_id(uuid)

        conn
        |> send_resp(200, Jason.encode!(dm))

      _ ->
        conn
        |> send_resp(401, Jason.encode!(%{error: "invalid id"}))
    end
  end

  post "/join-info" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user_id = conn.assigns.user_id
      dm_id = conn.body_params["dmId"]

      case Ecto.UUID.cast(dm_id) do
        {:ok, uuid} ->
          dm = Dms.get_dm_by_id(uuid)

          if not is_nil(dm) do
            DmSession.join_dm(dm.id, user_id)
          end

          conn
          |> send_resp(200, Jason.encode!(dm))

        _ ->
          conn
          |> send_resp(401, Jason.encode!(%{error: "invalid id"}))
      end
    else
      conn
      |> send_resp(401, Jason.encode!(%{error: "UNAUTHORIZED"}))
    end
  end

  post "/create" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    case has_user_id do
      true ->
        user_ids = conn.body_params["userIds"]

        # TODO: Support more than 2 people dm
        dm_exists = Dms.dm_exists?(Enum.at(user_ids, 0), Enum.at(user_ids, 1))

        if not dm_exists do
          dm = Dms.create_dm(user_ids)

          conn
          |> send_resp(200, Jason.encode!(dm))
        else
          dm = Dms.get_dm_by_user_ids(Enum.at(user_ids, 0), Enum.at(user_ids, 1))

          conn
          |> send_resp(200, Jason.encode!(dm))
        end

      false ->
        conn
        |> send_resp(401, Jason.encode!(%{error: "UNAUTHORIZED"}))
    end
  end

  get "/:id/messages" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    case has_user_id do
      true ->
        dm_id = conn.params["id"]
        cursor = String.to_integer(conn.params["cursor"])

        {messages, next_cursor} = Dms.get_dm_messages(dm_id, cursor)

        conn
        |> send_resp(
          200,
          Jason.encode!(%{messages: messages, nextCursor: next_cursor, initial: cursor == 0})
        )

      false ->
        conn
        |> send_resp(401, Jason.encode!(%{error: "UNAUTHORIZED"}))
    end
  end

  post "/:id/message" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    case has_user_id do
      true ->
        dm_id = conn.params["id"]
        text = conn.body_params["text"]
        user_id = conn.assigns.user_id

        message = Dms.create_dm_message(dm_id, user_id, text)

        DmSession.broadcast_ws(dm_id, %{op: "new_dm_message", d: %{message: message}})

        conn
        |> send_resp(200, Jason.encode!(message))

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
