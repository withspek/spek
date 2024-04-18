defmodule Routes.Channels do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/:id" do
    %Plug.Conn{params: %{"id" => id}} = conn

    case Ecto.UUID.cast(id) do
      {:ok, uuid} ->
        channel = Operations.Channels.get_channel_by_id(uuid)

        conn
        |> send_resp(200, Jason.encode!(%{channel: channel}))

      _ ->
        conn
        |> send_resp(402, Jason.encode!(%{error: "invalid id"}))
    end
  end

  get "/:id/members" do
    %Plug.Conn{params: %{"id" => id}} = conn

    case Ecto.UUID.cast(id) do
      {:ok, uuid} ->
        members = Operations.Channels.get_channel_members(uuid)

        conn
        |> send_resp(200, Jason.encode!(members))

      _ ->
        conn
        |> send_resp(200, Jason.encode!(%{error: "invalid id"}))
    end
  end

  match _ do
    conn
    |> send_resp(200, "Not found")
  end
end
