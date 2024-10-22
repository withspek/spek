defmodule Pulse.UserSession do
  use GenServer, restart: :temporary

  defmodule State do
    defstruct user_id: nil,
              pid: nil,
              username: nil,
              avatar_url: nil,
              current_conf_id: nil,
              muted: false,
              deafened: false
  end

  #################################################################################
  # REGISTRY AND SUPERVISION BOILERPLATE

  defp via(user_id), do: {:via, Registry, {Pulse.UserSessionRegistry, user_id}}

  defp cast(user_id, params), do: GenServer.cast(via(user_id), params)
  defp call(user_id, params), do: GenServer.call(via(user_id), params)

  def start_supervised(initial_values) do
    callers = [self() | Process.get(:"$callers", [])]

    case DynamicSupervisor.start_child(
           Pulse.UserSessionDynamicSupervisor,
           {__MODULE__, Keyword.merge(initial_values, callers: callers)}
         ) do
      {:error, {:already_started, pid}} -> {:ignored, pid}
      error -> error
    end
  end

  def child_spec(init), do: %{super(init) | id: Keyword.get(init, :user_id)}

  def count, do: Registry.count(Pulse.UserSessionRegistry)

  ###############################################################################
  ## INITIALIZATION BOILERPLATE

  def start_link(init) do
    GenServer.start_link(__MODULE__, init, name: via(init[:user_id]))
  end

  def init(init) do
    # transfer callers into the running process.
    Process.put(:"$callers", Keyword.get(init, :callers))
    {:ok, struct(State, init)}
  end

  ##############################################################################
  ## API HOOKS
  ## TODO: CHANGE CASTS TO CALLS

  def set(user_id, key, value), do: cast(user_id, {:set, key, value})

  defp set_impl(key, value, state) do
    {:noreply, Map.put(state, key, value)}
  end

  def send_ws(user_id, platfrom, msg), do: cast(user_id, {:send_ws, platfrom, msg})

  defp send_ws_impl(_platform, msg, state = %{pid: pid}) do
    if pid, do: send(pid, {:remote_send, msg})
    {:noreply, state}
  end

  def new_tokens(user_id, tokens), do: cast(user_id, {:new_tokens, tokens})

  def new_tokens_impl(tokens, state = %{pid: pid}) do
    if pid, do: send(pid, {:remote_send, %{op: "new-tokens", d: tokens}})
    {:noreply, state}
  end

  def set_state(user_id, info), do: cast(user_id, {:set_state, info})

  defp set_state_impl(info, state) do
    {:noreply, Map.merge(state, info)}
  end

  def get(user_id, key), do: call(user_id, {:get, key})

  defp get_impl(key, _reply, state) do
    {:reply, Map.get(state, key), state}
  end

  # temporary function that exists so that each user can only have
  # one tenant websocket.
  def set_active_ws(user_id, pid), do: call(user_id, {:set_active_ws, pid})

  defp set_active_ws(pid, _reply, state) do
    if state.pid do
      # terminates another websocket that happened to have been
      # running.
      Process.exit(state.pid, :normal)
    else
      Telescope.Users.set_online(state.user_id)
    end

    Process.monitor(pid)
    {:reply, :ok, %{state | pid: pid}}
  end

  def set_mute(user_id, value) when is_boolean(value), do: cast(user_id, {:set_mute, value})

  defp set_mute_impl(value, state = %{current_conf_id: current_conf_id}) do
    if current_conf_id do
      Pulse.ConfSession.mute(current_conf_id, state.user_id, value)
    end

    {:noreply, %{state | muted: value}}
  end

  def set_deafen(user_id, value) when is_boolean(value), do: cast(user_id, {:set_deafen, value})

  defp set_deafen_impl(value, state = %{current_conf_id: current_conf_id}) do
    if current_conf_id do
      Pulse.ConfSession.deafen(current_conf_id, state.user_id, value)
    end

    {:noreply, %{state | deafened: value}}
  end

  def set_current_conf_id(user_id, current_conf_id) do
    set_state(user_id, %{current_conf_id: current_conf_id})
  end

  def get_current_conf_id(user_id) do
    get(user_id, :current_conf_id)
  end

  @all [{{:_, :"$1", :_}, [], [:"$1"]}]
  def force_reconnects(rabbit_id) do
    Pulse.UserSessionRegistry
    |> Registry.select(@all)
    |> Enum.each(&reconnect(&1, rabbit_id))
  end

  def reconnect(user_pid, rabbit_id), do: GenServer.cast(user_pid, {:reconnect, rabbit_id})

  defp reconnect_impl(voice_server_id, state) do
    if state.pid || state.current_conf_id do
      case Pulse.ConfSession.get(state.current_conf_id, :voice_server_id) do
        ^voice_server_id ->
          conf = Telescope.Confs.get_conf_by_id(state.current_conf_id)
          Spek.Conf.join_voice_conf(state.user_id, conf)

        _ ->
          :ignore
      end
    end

    {:noreply, state}
  end

  ##############################################################################
  ## MESSAGING API.

  defp handle_disconnect(pid, state = %{pid: pid}) do
    Telescope.Users.set_offline(state.user_id)

    if state.current_conf_id do
      Spek.Conf.leave_conf(state.user_id, state.current_conf_id)
    end

    {:stop, :normal, state}
  end

  defp handle_disconnect(_, state), do: {:noreply, state}

  #############################################################################
  ## ROUTER

  def handle_cast({:set, key, value}, state), do: set_impl(key, value, state)
  def handle_cast({:set_mute, value}, state), do: set_mute_impl(value, state)
  def handle_cast({:send_ws, platform, msg}, state), do: send_ws_impl(platform, msg, state)
  def handle_cast({:new_tokens, tokens}, state), do: new_tokens_impl(tokens, state)
  def handle_cast({:set_state, info}, state), do: set_state_impl(info, state)
  def handle_cast({:set_deafen, value}, state), do: set_deafen_impl(value, state)

  def handle_cast({:reconnect, voice_server_id}, state),
    do: reconnect_impl(voice_server_id, state)

  def handle_call({:get, key}, reply, state), do: get_impl(key, reply, state)
  def handle_call({:set_active_ws, pid}, reply, state), do: set_active_ws(pid, reply, state)

  def handle_info({:DOWN, _ref, :process, pid, _reason}, state), do: handle_disconnect(pid, state)
end
