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

  put "/:id" do
    %Plug.Conn{params: %{"id" => id}} = conn

    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user_id = conn.assigns.user_id

      data = %{
        "name" => conn.body_params["name"],
        "description" => conn.body_params["description"]
      }

      case Ecto.UUID.cast(id) do
        {:ok, uuid} ->
          {:ok, channel} = Channels.update_channel(uuid, data, user_id)

          conn
          |> put_resp_content_type("application/json")
          |> send_resp(200, Jason.encode!(%{channel: channel}))

        _ ->
          conn
          |> put_resp_content_type("application/json")
          |> send_resp(200, Jason.encode!(%{error: "invalid id"}))
      end
    else
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(402, Jason.encode!(%{error: "Not authenticated"}))
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

  post "/join" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user_id = conn.assigns.user_id
      channel_id = conn.params["channelId"]

      case Operations.Channels.join_channel(channel_id, user_id) do
        {:ok, channel} ->
          conn
          |> put_resp_content_type("application/json")
          |> send_resp(200, Jason.encode!(%{channel: channel}))

        {:error, error} ->
          conn
          |> put_resp_content_type("application/json")
          |> send_resp(404, Jason.encode!(error))
      end
    else
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(402, Jason.encode!(%{error: "Not authenticated"}))
    end
  end

  post "/create" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user_id = conn.assigns.user_id

      data = %{
        name: conn.body_params["name"],
        description: conn.body_params["description"],
        creatorId: user_id,
        communityId: conn.body_params["communityId"]
      }

      case Operations.Channels.create_channel(data, user_id) do
        {:ok, channel, _} ->
          conn
          |> put_resp_content_type("application/json")
          |> send_resp(200, Jason.encode!(%{channel: channel}))

        {:error,
         %Ecto.Changeset{
           errors: [name: {"has already been taken", _}]
         }} ->
          conn
          |> put_resp_content_type("application/json")
          |> send_resp(404, Jason.encode!(%{error: "That name is in use."}))
      end
    else
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(402, Jason.encode!(%{error: "Not authenticated"}))
    end
  end

  post "/leave" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user_id = conn.assigns.user_id
      channel_id = conn.params["channelId"]

      Operations.Channels.leave_channel(channel_id, user_id)

      conn
      |> put_resp_content_type("application/json")
      |> send_resp(200, Jason.encode!(%{success: true}))
    else
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(402, Jason.encode!(%{error: "Not authenticated"}))
    end
  end

  delete "/delete" do
    %Plug.Conn{params: %{"channelId" => id}} = conn
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      case Ecto.UUID.cast(id) do
        {:ok, uuid} ->
          user_id = conn.assigns.user_id

          Operations.Channels.delete_channel(uuid, user_id)

          conn
          |> put_resp_content_type("application/json")
          |> send_resp(200, Jason.encode!(%{success: true}))

        _ ->
          conn
          |> put_resp_content_type("application/json")
          |> send_resp(200, Jason.encode!(%{error: "invalid id"}))
      end
    else
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(402, Jason.encode!(%{error: "not authenticated"}))
    end
  end

  match _ do
    conn
    |> send_resp(200, "Not found")
  end
end
