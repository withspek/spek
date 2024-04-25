defmodule Routes.Channels do
  alias Operations.Channels
  use Plug.Router

  plug(:match)
  plug(Plugs.CheckAuth, %{shouldThrow: false})
  plug(:dispatch)

  get "/:id" do
    %Plug.Conn{params: %{"id" => id}} = conn

    user_id =
      if Map.has_key?(conn.assigns, :user_id),
        do: conn.assigns.user_id,
        else: Ecto.UUID.autogenerate()

    channel = Channels.get_channel_by_id(id, user_id)

    cond do
      is_nil(channel) ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(400, Jason.encode!(%{error: "That channel does not exist"}))

      channel.isPrivate ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(400, Jason.encode!(%{error: "channel is not public"}))

      true ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(200, Jason.encode!(%{channel: channel}))
    end
  end

  get "/:id/members" do
    %Plug.Conn{params: %{"id" => id}} = conn

    case Ecto.UUID.cast(id) do
      {:ok, uuid} ->
        members = Operations.Channels.get_channel_members(uuid)

        conn
        |> put_resp_content_type("application/json")
        |> send_resp(200, Jason.encode!(members))

      _ ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(200, Jason.encode!(%{error: "invalid id"}))
    end
  end

  match _ do
    conn
    |> send_resp(200, "Not found")
  end
end
