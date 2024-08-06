defmodule Breeze.Routes.V1.Users do
  use Plug.Router

  alias Telescope.Communities
  alias Telescope.Users
  alias Telescope.Lodges
  alias Pulse.UserSession
  alias Breeze.Plugs

  plug(Plugs.CheckAuth, %{shouldThrow: false})
  plug(:match)
  plug(:dispatch)

  if Mix.env() == :dev do
    get "/" do
      users = Users.get_users()

      conn |> send_resp(200, Jason.encode!(users))
    end
  end

  get "/me" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user = Users.get_by_user_id(conn.assigns.user_id)

      conn
      |> send_resp(200, Jason.encode!(%{"user" => user}))
    else
      IO.inspect(conn.assigns)

      conn
      |> send_resp(200, Jason.encode!(%{"user" => nil}))
    end
  end

  get "/:id" do
    %Plug.Conn{params: %{"id" => id}} = conn

    case Ecto.UUID.cast(id) do
      {:ok, uuid} ->
        user = Users.get_by_user_id(uuid)

        if is_nil(user) do
          conn
          |> send_resp(200, Jason.encode!(%{error: "user with this id does not exist"}))
        else
          conn
          |> send_resp(200, Jason.encode!(%{user: user}))
        end

      _ ->
        conn
        |> send_resp(200, Jason.encode!(%{error: "invalid user id"}))
    end
  end

  put "/" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user_id = conn.assigns.user_id

      data = %{
        "displayName" => conn.body_params["displayName"],
        "bio" => conn.body_params["bio"],
        "username" => conn.body_params["username"]
      }

      result = Users.update_profile(user_id, data)

      case result do
        {:ok, user} ->
          UserSession.send_ws(user.id, nil, %{
            op: "profile_update",
            d: %{user: user}
          })

          conn |> send_resp(200, Jason.encode!(user))

        {:error,
         %Ecto.Changeset{
           errors: [username: {"has already been taken", _}]
         }} ->
          conn
          |> send_resp(200, Jason.encode!(%{error: "This username is taken"}))
      end
    else
      conn
      |> send_resp(401, Jason.encode!(%{error: "UNAUTHORIZED"}))
    end
  end

  get "/@me/lodges" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user_id = conn.assigns.user_id

      lodges = Lodges.get_user_lodges(user_id)

      conn
      |> send_resp(200, Jason.encode!(lodges))
    else
      conn
      |> send_resp(401, Jason.encode!(%{error: "UNAUTHORIZED"}))
    end
  end

  get "/@me/communities" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user_id = conn.assigns.user_id
      cursor = String.to_integer(conn.params["cursor"])

      {communities, nextCursor} = Communities.get_user_joined_communities(cursor, user_id)

      conn
      |> send_resp(200, Jason.encode!(%{communities: communities, nextCursor: nextCursor}))
    else
      conn
      |> send_resp(401, Jason.encode!(%{error: "UNAUTHORIZED"}))
    end
  end

  match _ do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(404, "Not found")
  end
end
