defmodule Routes.Threads do
  use Plug.Router

  alias Operations.Users
  alias Operations.Channels

  plug(:match)
  plug(Plugs.CheckAuth, %{shouldThrow: false})
  plug(:dispatch)

  get "/:channelId" do
    %Plug.Conn{params: %{"channelId" => channelId}} = conn

    case Ecto.UUID.cast(channelId) do
      {:ok, uuid} ->
        threads = Channels.get_threads_by_channel_id(uuid)

        cond do
          is_nil(threads) ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(400, Jason.encode!(%{error: "That channel does not exist"}))

          true ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(200, Jason.encode!(threads))
        end

      _ ->
        conn
        |> send_resp(400, Jason.encode!(%{"error" => "Invalid channel id"}))
    end
  end

  post "/create" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user = Users.get_user_id(conn.assigns.user_id)

      data = %{
        :creatorId => user.id,
        :channelId => conn.body_params["channelId"],
        :name => conn.body_params["name"]
      }

      thread = Operations.Communities.create_thread(data)

      conn
      |> send_resp(
        200,
        Jason.encode!(thread)
      )
    else
      conn
      |> send_resp(402, "UNAUTHORIZED")
    end
  end
end
