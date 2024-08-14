defmodule Breeze.Routes.V1.Confs do
  use Plug.Router

  alias Breeze.Plugs

  plug(Plugs.CheckAuth)
  plug(:match)
  plug(:dispatch)

  get "/:community_id" do
    %Plug.Conn{params: %{"community_id" => community_id, "cursor" => cursor}} = conn
    user_id = conn.assigns.user_id
    {confs, next_cursor} = Telescope.Confs.get_top_public_confs(community_id, user_id, cursor)

    conn
    |> send_resp(200, Jason.encode!(%{nextCursor: next_cursor, confs: confs}))
  end

  post "/create" do
    user_id = conn.assigns.user_id

    %Plug.Conn{
      params: %{"name" => conf_name, "description" => description, "communityId" => commmunity_id}
    } = conn

    resp =
      case Spek.Conf.create_conf(user_id, conf_name, description, commmunity_id, false) do
        {:ok, d} ->
          d

        {:error, d} ->
          %{error: d}
      end

    conn
    |> send_resp(200, Jason.encode!(resp))
  end

  post "/:id/join" do
    %Plug.Conn{params: %{"id" => conf_id}} = conn
    user_id = conn.assigns.user_id

    resp = Spek.Conf.join_conf(user_id, conf_id)

    conn
    |> send_resp(200, Jason.encode!(resp))
  end

  post "/:id/leave" do
    %Plug.Conn{params: %{"id" => conf_id}} = conn
    user_id = conn.assigns.user_id

    resp = Spek.Conf.leave_conf(user_id, conf_id)

    conn
    |> send_resp(200, Jason.encode!(resp))
  end
end
