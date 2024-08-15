defmodule Breeze.SocketHandler do
  require Logger

  alias Pulse.UserSession
  alias Pulse.ConfSession
  alias Telescope.Users
  alias Telescope.Confs

  defstruct awaiting_init: true,
            user_id: nil,
            encoding: nil,
            compression: nil,
            callers: []

  @behaviour :cowboy_websocket

  def init(request, _state) do
    props = :cowboy_req.parse_qs(request)

    compression =
      case :proplists.get_value("compression", props) do
        p when p in ["zlib_json", "json"] ->
          :zlib

        _ ->
          nil
      end

    encoding =
      case :proplists.get_value("encoding", props) do
        "etf" ->
          :etf

        _ ->
          nil
      end

    state = %__MODULE__{
      awaiting_init: true,
      user_id: nil,
      encoding: encoding,
      compression: compression,
      callers: get_callers(request)
    }

    {:cowboy_websocket, request, state}
  end

  defp get_callers(_), do: []

  @auth_timeout 10_000

  def websocket_init(state) do
    Process.send_after(self(), {:finish_awaiting}, @auth_timeout)
    Process.put(:"$callers", state.callers)

    {:ok, state}
  end

  def websocket_info({:finish_awaiting}, state) do
    if state.awaiting_init do
      {:stop, state}
    else
      {:ok, state}
    end
  end

  def websocket_info({:remote_send, message}, state) do
    {:reply, construct_socket_msg(state.encoding, state.compression, message), state}
  end

  def websocket_info({:kill}, state) do
    {:reply, {:close, 4003, "killed_by_server"}, state}
  end

  def websocket_info({:EXIT, _, _}, state) do
    {:ok, state}
  end

  def websocket_info({:send_linked_to_session, message}, state) do
    send(state.linked_session, message)
    {:ok, state}
  end

  def websocket_handle({:text, "ping"}, state) do
    {:reply, construct_socket_msg(state.encoding, state.compression, "pong"), state}
  end

  def websocket_handle({:ping, _}, state) do
    {:reply, construct_socket_msg(state.encoding, state.compression, "pong"), state}
  end

  def websocket_handle({:text, json_command}, state) do
    with {:ok, message_map} <- Jason.decode(json_command) do
      case message_map["op"] do
        "auth" ->
          %{
            "accessToken" => accessToken,
            "refreshToken" => refreshToken,
            "reconnectToVoice" => reconnectToVoice,
            "muted" => muted,
            "deafened" => deafened
          } = message_map["d"]

          case Spek.Utils.TokenUtils.tokens_to_user_id(accessToken, refreshToken) do
            {nil, nil} ->
              {:reply,
               construct_socket_msg(state.encoding, state.compression, %{
                 op: "auth-good",
                 d: %{user: nil, error: "Invalid auth credentials"}
               }), state}

            x ->
              {user_id, tokens, user} =
                case x do
                  {user_id, tokens} -> {user_id, tokens, Users.get_by_user_id(user_id)}
                  y -> y
                end

              if user do
                # note that this will start the session and will be ignored if the
                # session is already running.
                UserSession.start_supervised(
                  user_id: user_id,
                  username: user.username,
                  avatar_url: user.avatarUrl,
                  display_name: user.displayName
                )

                # currently we only allow one active websocket connection per-user
                # at some point soon we're going to make this multi-connection, and we
                # won't have to do this.
                UserSession.set_active_ws(user.id, self())

                if tokens do
                  UserSession.new_tokens(user.id, tokens)
                end

                confIdFromFrontend = Map.get(message_map["d"], "currentConfId", nil)

                current_conf =
                  cond do
                    not is_nil(user.current_conf_id) ->
                      # @todo this should probably go inside conf business logic
                      conf = Confs.get_conf_by_id(user.current_conf_id)

                      ConfSession.start_supervised(
                        conf_id: user.current_conf_id,
                        voice_server_id: conf.voice_server_id
                      )

                      ConfSession.join_conf(conf.id, user.id, muted, deafened)

                      if reconnectToVoice == true do
                        Spek.Conf.join_voice_conf(user.id, conf)
                      end

                      conf

                    not is_nil(confIdFromFrontend) ->
                      case Spek.Conf.join_conf(user.id, confIdFromFrontend) do
                        %{conf: conf} -> conf
                        _ -> nil
                      end

                    true ->
                      nil
                  end

                {:reply,
                 construct_socket_msg(state.encoding, state.compression, %{
                   op: "auth-good",
                   d: %{user: user, currentConf: current_conf}
                 }), %{state | user_id: user_id, awaiting_init: false}}
              else
                {:reply,
                 construct_socket_msg(state.encoding, state.compression, %{
                   op: "auth-good",
                   d: %{user: nil, error: "Invalid auth credentials"}
                 }), state}
              end
          end

        _ ->
          if not is_nil(state.user_id) do
            try do
              case message_map do
                %{"op" => _op, "d" => _d, "fetchId" => fetch_id} ->
                  {:reply,
                   prepare_socket_msg(
                     %{
                       op: "fetch_done",
                       d: "",
                       fetchId: fetch_id
                     },
                     state
                   ), state}

                %{"op" => op, "d" => d} ->
                  handler(op, d, state)
              end
            rescue
              e ->
                err_msg = Exception.message(e)

                IO.inspect(e)
                Logger.error(err_msg)
                Logger.error(Exception.format_stacktrace())
                op = Map.get(message_map, "op", "")
                IO.puts("error for op: " <> op)

                {:reply,
                 construct_socket_msg(state.encoding, state.compression, %{
                   op: "error",
                   d: err_msg
                 }), state}
            catch
              _, e ->
                err_msg = Kernel.inspect(e)
                IO.puts(err_msg)
                Logger.error(Exception.format_stacktrace())

                op = Map.get(message_map, "op", "")
                IO.puts("error for op: " <> op)

                {:reply,
                 construct_socket_msg(state.encoding, state.compression, %{
                   op: "error",
                   d: err_msg
                 }), state}
            end
          else
            {:reply, {:close, 4004, "not_authenticated"}, state}
          end
      end
    end
  end

  def handler("speaking_change", %{"value" => value}, state) do
    if current_conf_id = Telescope.Users.get_current_conf_id(state.user_id) do
      Pulse.ConfSession.speaking_change(current_conf_id, state.user_id, value)
    end

    {:ok, state}
  end

  def handler("mute", %{"value" => value}, state) do
    Pulse.UserSession.set_mute(state.user_id, value)
    {:ok, state}
  end

  def handler("deafen", %{"value" => value}, state) do
    Pulse.UserSession.set_deafen(state.user_id, value)
    {:ok, state}
  end

  def handler(op, data, state) do
    with {:ok, conf_id} <- Telescope.Users.tuple_get_current_conf_id(state.user_id) do
      voice_server_id = Pulse.ConfSession.get(conf_id, :voice_server_id)

      d =
        if String.first(op) == "@" do
          Map.merge(data, %{
            peerId: state.user_id,
            confId: conf_id
          })
        else
          data
        end

      Pulse.Voice.send(voice_server_id, %{
        op: op,
        d: d,
        uid: state.user_id
      })

      {:ok, state}
    else
      x ->
        IO.puts("you should never see this general rabbbitmq handler in socker_handler")
        IO.inspect(x)

        {:reply,
         prepare_socket_msg(
           %{
             op: "error",
             d: "you should never see this, if you do, try refreshing"
           },
           state
         ), state}
    end
  end

  defp construct_socket_msg(encoding, compression, data) do
    data =
      case encoding do
        :etf ->
          data

        _ ->
          data |> Jason.encode!()
      end

    case compression do
      :zlib ->
        z = :zlib.open()
        :zlib.deflateInit(z)

        data = :zlib.deflate(z, data, :finish)

        :zlib.deflateEnd(z)

        {:binary, data}

      _ ->
        {:text, data}
    end
  end

  def prepare_socket_msg(data, %{compression: compression, encoding: encoding}) do
    data
    |> encode_data(encoding)
    |> compress_data(compression)
  end

  defp encode_data(data, :etf) do
    data
  end

  defp encode_data(data, _encoding) do
    data |> Jason.encode!()
  end

  defp compress_data(data, :zlib) do
    z = :zlib.open()

    :zlib.deflateInit(z)
    data = :zlib.deflate(z, data, :finish)
    :zlib.deflateEnd(z)

    {:binary, data}
  end

  defp compress_data(data, _compression) do
    {:text, data}
  end
end
