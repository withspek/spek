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

  post "/:id/join_and_get_info" do
    %Plug.Conn{params: %{"id" => conf_id}} = conn
    user_id = conn.assigns.user_id

    resp =
      case Spek.Conf.join_conf(user_id, conf_id) do
        %{error: err} ->
          %{error: err}

        %{conf: conf} ->
          {conf_id, users} = Telescope.Users.get_users_in_current_conf(user_id)

          case Pulse.ConfSession.lookup(conf_id) do
            [] ->
              %{error: "Conference no longer exists"}

            _ ->
              {mute_map, deaf_map, auto_speaker, active_speaker_map} =
                Pulse.ConfSession.get_maps(conf_id)

              payload = %{
                conf: conf,
                users: users,
                muteMap: mute_map,
                deafMap: deaf_map,
                autoSpeaker: auto_speaker,
                activeSpeakerMap: active_speaker_map
              }

              payload
          end
      end

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
