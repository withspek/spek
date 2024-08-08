defmodule Pulse.ConfSession do
  use GenServer, restart: :temporary

  defmodule State do
    defstruct conf_id: "",
              conf_creator_id: "",
              voice_server_id: "",
              users: [],
              mute_map: %{},
              deaf_map: %{},
              invite_map: %{},
              active_speaker_map: %{},
              auto_speak: false
  end

  # REGISTRY AND SUPERVISION BOILERPLATE

  defp via(conf_id), do: {:via, Registry, {Pulse.ConfSessionRegistry, conf_id}}

  defp cast(conf_id, params), do: GenServer.cast(via(conf_id), params)
  defp call(conf_id, params), do: GenServer.call(via(conf_id), params)

  def start_supervised(initial_values) do
    callers = [self() | Process.get(:"$callers", [])]

    case DynamicSupervisor.start_child(
           Pulse.ConfSessionDynamicSupervisor,
           {__MODULE__, Keyword.merge(initial_values, callers: callers)}
         ) do
      {:error, {:already_started, pid}} -> {:ignored, pid}
      error -> error
    end
  end

  def child_spec(init), do: %{super(init) | id: Keyword.get(init, :conf_id)}

  def count, do: Registry.count(Pulse.ConfSessionRegistry)
  def looup(conf_id), do: Registry.lookup(Pulse.ConfSessionRegistry, conf_id)

  ## INITIALIZATION BOILERPLATE

  def start_link(init) do
    GenServer.start_link(__MODULE__, init, name: via(init[:conf_id]))
  end

  def init(init) do
    # adopt callers from the call point
    Process.put(:"$callers", init[:callers])

    {:ok, struct(State, init)}
  end

  ## API

  def ws_fan(users, msg) do
    Enum.each(users, fn uid ->
      Pulse.UserSession.send_ws(uid, nil, msg)
    end)
  end

  def get(conf_id, key), do: call(conf_id, {:get, key})

  def get_impl(key, _reply, state) do
    {:reply, Map.get(state, key, state)}
  end

  def get_maps(conf_id), do: call(conf_id, :get_maps)

  defp get_maps_impl(_reply, state) do
    {:reply, {state.muteMap, state.deafMap, state.auto_speaker, state.activeSpeakerMap}, state}
  end

  def set(conf_id, key, value), do: cast(conf_id, {:set, key, value})

  defp set_impl(key, value, state) do
    {:noreply, Map.put(state, key, value)}
  end

  def broadcast_ws(conf_id, msg), do: cast(conf_id, {:broadcast_ws, msg})

  defp broadcast_ws_impl(msg, state) do
    ws_fan(state.users, msg)
    {:noreply, state}
  end

  ## ROUTER

  def handle_call({:get, key}, reply, state), do: get_impl(key, reply, state)

  def handle_call(:get_maps, reply, state), do: get_maps_impl(reply, state)

  def handle_cast({:set, key, value}, state), do: set_impl(key, value, state)

  def handle_cast({:broadcast_ws, msg}, state) do
    broadcast_ws_impl(msg, state)
  end
end
