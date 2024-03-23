defmodule Spek.UserSession do
  use GenServer

  defmodule State do
    defstruct user_id: nil,
              pid: nil
  end

  #################################################################################
  # REGISTRY AND SUPERVISION BOILERPLATE

  defp via(user_id), do: {:via, Registry, {Spek.UserSesionRegistery, user_id}}

  defp cast(user_id, params), do: GenServer.cast(via(user_id), params)
  defp call(user_id, params), do: GenServer.call(via(user_id), params)

  def start_supervised(initial_values) do
    callers = [self() | Process.get(:"$callers", [])]

    case DynamicSupervisor.start_child(
           Spek.UserSesionDynamicSupervisor,
           {__MODULE__, Keyword.merge(initial_values, callers: callers)}
         ) do
      {:error, {:already_started, pid}} -> {:ignored, pid}
      error -> error
    end
  end

  def child_spec(init), do: %{super(init) | id: Keyword.get(init, :user_id)}

  def count, do: Registry.count(Spek.UserSesionRegistery)

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

  def set_pid(user_id, pid), do: call(user_id, {:set_pid, pid})

  defp set_pid(pid, _reply, state) do
    if state.pid do
      send(state.pid, {:kill})
    else
      # TODO: SET ONLINE STATUS
    end

    Process.monitor(pid)
    {:reply, :ok, %{state | pid: pid}}
  end

  ##############################################################################
  ## MESSAGING API.

  defp handle_disconnect(pid, state = %{pid: pid}) do
    # TODO: SET OFFLINE STATUS

    {:stop, :normal, state}
  end

  defp handle_disconnect(_, state), do: {:noreply, state}

  #############################################################################
  ## ROUTER

  def handle_cast({:set, key, value}, state), do: set_impl(key, value, state)

  def handle_cast({:send_ws, platform, msg}, state), do: send_ws_impl(platform, msg, state)
  def handle_cast({:new_tokens, tokens}, state), do: new_tokens_impl(tokens, state)
  def handle_cast({:set_state, info}, state), do: set_state_impl(info, state)

  def handle_call({:get, key}, reply, state), do: get_impl(key, reply, state)
  def handle_call({:set_pid, pid}, reply, state), do: set_pid(pid, reply, state)

  def handle_info({:DOWN, _ref, :process, pid, _reason}, state), do: handle_disconnect(pid, state)
end
