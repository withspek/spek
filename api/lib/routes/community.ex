defmodule Routes.Community do
  use Plug.Router

  alias Operations.Channels
  alias Operations.Communities
  alias Operations.Users

  plug(:match)
  plug(Plugs.CheckAuth, %{shouldThrow: false})
  plug(:dispatch)

  get "/all" do
    communities = Communities.get_top_communities(40)

    conn
    |> send_resp(200, Jason.encode!(%{"communities" => communities}))
  end

  get "/:id" do
    %Plug.Conn{params: %{"id" => id}} = conn

    case Ecto.UUID.cast(id) do
      {:ok, uuid} ->
        community = Communities.get_community_by_id(uuid)

        cond do
          is_nil(community) ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(400, Jason.encode!(%{error: "That community does not exist"}))

          community.isPrivate ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(400, Jason.encode!(%{error: "Community is not public"}))

          true ->
            channels = Channels.get_channels_by_community_id(uuid)

            conn
            |> put_resp_content_type("application/json")
            |> send_resp(200, Jason.encode!(%{community: community, channels: channels}))
        end

      _ ->
        conn
        |> send_resp(400, Jason.encode!(%{"error" => "Invalid community id"}))
    end
  end

  get "/:id/members" do
    %Plug.Conn{params: %{"id" => id}} = conn

    case Ecto.UUID.cast(id) do
      {:ok, uuid} ->
        members = Communities.get_community_members(uuid)

        conn
        |> send_resp(200, Jason.encode!(members))

      _ ->
        conn
        |> send_resp(400, Jason.encode!(%{error: "Community id is not valid"}))
    end
  end

  get "/:id/threads" do
    %Plug.Conn{params: %{"id" => id}} = conn

    case Ecto.UUID.cast(id) do
      {:ok, uuid} ->
        conn
        |> send_resp(200, Jason.encode!(uuid))

      _ ->
        conn
        |> send_resp(400, Jason.encode!(%{error: "Community id is not valid"}))
    end
  end

  get "/:id/permissions" do
    %Plug.Conn{params: %{"id" => id}} = conn
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    cond do
      has_user_id ->
        permissions = Communities.get_community_permissions(id, conn.assigns.user_id)

        if not is_nil(permissions) do
          conn
          |> send_resp(200, Jason.encode!(permissions))
        else
          conn
          |> send_resp(
            200,
            Jason.encode!(%{isAdmin: false, isMember: false, isMod: false, isBlocked: false})
          )
        end

      true ->
        conn
        |> send_resp(
          200,
          Jason.encode!(%{isAdmin: false, isMember: false, isMod: false, isBlocked: false})
        )
    end
  end

  post "/create" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user = Users.get_user_id(conn.assigns.user_id)

      data = %{
        "ownerId" => user.id,
        "name" => conn.body_params["name"],
        "description" => conn.body_params["description"]
      }

      {:ok, community, channel} = Operations.Communities.create_community(data)

      conn
      |> send_resp(
        200,
        Jason.encode!(%{"channels" => channel, "community" => community})
      )
    else
      conn
      |> send_resp(402, "UNAUTHORIZED")
    end
  end

  post "/join" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      conn
      |> send_resp(200, Jason.encode!("Hellow orld"))
    else
      conn
      |> send_resp(401, Jason.encode!(%{error: "Not authorized"}))
    end
  end

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
