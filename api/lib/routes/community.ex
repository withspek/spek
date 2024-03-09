defmodule Routes.Community do
  use Plug.Router

  alias Operations.Communities
  alias Operations.Users

  plug(:match)
  plug(Plugs.CheckAuth, %{shouldThrow: false})
  plug(:dispatch)

  get "/all" do
    communities = Communities.get_top_communities(50)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Jason.encode!(%{communities: communities}, []))
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
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(200, Jason.encode!(community))
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
        |> send_resp(200, Jason.encode!(%{"members" => members}))

      _ ->
        conn
        |> send_resp(400, Jason.encode!(%{error: "Community id is not valid"}))
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

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
