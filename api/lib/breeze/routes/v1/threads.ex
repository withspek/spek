defmodule Breeze.Routes.V1.Threads do
  use Plug.Router

  alias Telescope.Communities
  alias Telescope.Subscribers
  alias Telescope.Messages
  alias Telescope.Channels
  alias Pulse.ThreadSession

  plug(:match)
  plug(Breeze.Plugs.CheckAuth, %{shouldThrow: false})
  plug(:dispatch)

  get "/" do
    %Plug.Conn{params: %{"cursor" => cursor}} = conn

    {threads, nextCursor} = Communities.get_top_threads_with_message_counts(cursor)

    conn
    |> send_resp(200, Jason.encode!(%{threads: threads, nextCursor: nextCursor}))
  end

  get "/:id" do
    %Plug.Conn{params: %{"id" => id}} = conn

    case Ecto.UUID.cast(id) do
      {:ok, uuid} ->
        has_user_id = Map.has_key?(conn.assigns, :user_id)
        user_id = if has_user_id, do: conn.assigns.user_id, else: Ecto.UUID.autogenerate()
        thread = Channels.get_thread_by_id(uuid, user_id)

        cond do
          is_nil(thread) ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(400, Jason.encode!(%{error: "That thread does not exist"}))

          true ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(200, Jason.encode!(thread))
        end

      _ ->
        conn
        |> send_resp(400, Jason.encode!(%{"error" => "Invalid thread id"}))
    end
  end

  get "/:id/messages" do
    %Plug.Conn{params: %{"id" => threadId, "cursor" => cursorStr}} = conn

    case Ecto.UUID.cast(threadId) do
      {:ok, uuid} ->
        cursor = String.to_integer(cursorStr)
        {messages, next_cursor} = Messages.get_thread_messages(uuid, cursor)

        conn
        |> send_resp(
          200,
          Jason.encode!(%{messages: messages, nextCursor: next_cursor, initial: cursor == 0})
        )

      _ ->
        conn
        |> send_resp(400, Jason.encode!(%{"error" => "Invalid thread id"}))
    end
  end

  post "/:id/send-message" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      %Plug.Conn{params: %{"id" => threadId}} = conn

      case Ecto.UUID.cast(threadId) do
        {:ok, uuid} ->
          data = %{
            "threadId" => uuid,
            "userId" => conn.body_params["userId"],
            "text" => conn.body_params["text"]
          }

          message = Messages.create_thread_message(data)

          ThreadSession.broadcast_ws(uuid, %{
            op: "new_thread_message",
            d: %{message: message}
          })

          conn
          |> send_resp(200, Jason.encode!(message))

        _ ->
          conn
          |> send_resp(200, Jason.encode!(%{"error" => "Invalid thread id"}))
      end
    else
      conn
      |> send_resp(200, Jason.encode!(%{"error" => "NOT AUTHORIZED"}))
    end
  end

  get "/all/:channelId" do
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
      user_id = conn.assigns.user_id

      data = %{
        :creatorId => user_id,
        :channelId => conn.body_params["channelId"],
        :communityId => conn.body_params["communityId"],
        :name => conn.body_params["name"]
      }

      thread = Channels.create_thread(data)

      ThreadSession.start_supervised(thread_id: thread.id)
      ThreadSession.join_thread(thread.id, user_id)

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

  post "/join-info" do
    thread_id = conn.body_params["threadId"]

    case Ecto.UUID.cast(thread_id) do
      {:ok, uuid} ->
        has_user_id = Map.has_key?(conn.assigns, :user_id)
        user_id = if has_user_id, do: conn.assigns.user_id, else: Ecto.UUID.autogenerate()

        thread = Channels.get_thread_by_id(uuid, user_id)

        if not is_nil(thread) and has_user_id do
          ThreadSession.join_thread(thread.id, user_id)
        end

        conn
        |> send_resp(200, Jason.encode!(thread))

      _ ->
        conn
        |> send_resp(401, Jason.encode!(%{error: "invalid id"}))
    end
  end

  post "/subscribe" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user_id = conn.assigns.user_id
      thread_id = conn.body_params["threadId"]

      Subscribers.raw_insert(thread_id, user_id)

      conn
      |> send_resp(200, Jason.encode!(%{success: true}))
    else
      conn
      |> send_resp(401, Jason.encode!(%{error: "UNAUTHORIZED"}))
    end
  end

  post "/unsubscribe" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user_id = conn.assigns.user_id
      thread_id = conn.body_params["threadId"]

      Subscribers.delete(thread_id, user_id)

      conn
      |> send_resp(200, Jason.encode!(%{success: true}))
    else
      conn
      |> send_resp(401, Jason.encode!(%{error: "UNAUTHORIZED"}))
    end
  end
end
