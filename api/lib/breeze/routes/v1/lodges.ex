defmodule Breeze.Routes.V1.Lodges do
  use Plug.Router

  alias Breeze.Plugs
  alias Telescope.Lodges

  plug(Plugs.CheckAuth, %{shouldThrow: false})
  plug(:match)
  plug(:dispatch)

  get "/:lodge_id/members" do
    %Plug.Conn{params: %{"lodge_id" => lodge_id}} = conn

    case Lodges.get_lodge_by_id(lodge_id) do
      nil ->
        conn
        |> send_resp(404, Jason.encode!(%{message: "DM not found"}))

      lodge ->
        conn
        |> send_resp(200, Jason.encode!(lodge.recipients))
    end
  end

  post "/create" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      data = %{
        owner_id: conn.assigns.user_id,
        users: conn.body_params["users"]
      }

      type = if length(data.users) > 2, do: 2, else: 1

      recipients = Lodges.get_lodge_recipients(data.users)

      {:ok, lodge} = Lodges.create_lodge(recipients, data.owner_id, type)

      conn
      |> send_resp(200, Jason.encode!(%{"lodge" => lodge}))
    else
      conn
      |> send_resp(402, Jason.encode!(%{error: "Missing Auth credentials"}))
    end
  end

  delete "/:lodge_id" do
    %Plug.Conn{params: %{"lodge_id" => lodge_id}} = conn
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      Lodges.delete_lodge(lodge_id, conn.assigns.user_id)

      conn
      |> send_resp(200, Jason.encode!(%{success: true}))
    else
      conn
      |> send_resp(402, Jason.encode!(%{error: "Missing Auth credentials"}))
    end
  end

  post "/:lodge_id/add-recipient" do
    %Plug.Conn{params: %{"lodge_id" => lodge_id, "userId" => user_id}} = conn
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      lodge = Lodges.get_lodge_by_id(lodge_id)

      case Lodges.add_recipient(lodge, user_id) do
        nil ->
          conn
          |> send_resp(200, Jason.encode!(%{success: false}))

        _ ->
          conn
          |> send_resp(200, Jason.encode!(%{success: true}))
      end
    else
      conn
      |> send_resp(402, Jason.encode!(%{error: "Missing Auth credentials"}))
    end
  end

  post "/:lodge_id/remove-recipient" do
    %Plug.Conn{params: %{"lodge_id" => lodge_id, "userId" => user_id}} = conn
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      lodge = Lodges.get_lodge_by_id(lodge_id)

      case Lodges.remove_recipient(lodge, user_id) do
        nil ->
          conn
          |> send_resp(200, Jason.encode!(%{success: false}))

        _ ->
          conn
          |> send_resp(200, Jason.encode!(%{success: true}))
      end
    else
      conn
      |> send_resp(402, Jason.encode!(%{error: "Missing Auth credentials"}))
    end
  end

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
