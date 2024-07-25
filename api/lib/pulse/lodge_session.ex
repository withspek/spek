defmodule Pulse.LodgeSession do
  use GenServer, restart: :temporary

  alias Telescope.Users

  defmodule State do
    defstruct lodge_id: "",
              users: []
  end

  #################################################################################
  # REGISTRY AND SUPERVISION BOILERPLATE

  defp via(lodge_id), do: {:via, Registry, {Pulse.LodgeSessionRegistry, lodge_id}}

  defp cast(lodge_id, params), do: GenServer.cast(via(lodge_id), params)
  defp call(lodge_id, params), do: GenServer.call(via(lodge_id), params)

  def start_supervised(initial_values) do
    callers = [self() | Process.get(:"$callers", [])]

    case DynamicSupervisor.start_child(
           Pulse.LodgeSessionDynamicSupervisor,
           {__MODULE__, Keyword.merge(initial_values, callers: callers)}
         ) do
      {:error, {:already_started, pid}} -> {:ignored, pid}
      error -> error
    end
  end

  def child_spec(init), do: %{super(init) | id: Keyword.get(init, :lodge_id)}

  def count, do: Registry.count(Pulse.LodgeSessionRegistry)
  def lookup(lodge_id), do: Registry.lookup(Pulse.LodgeSessionRegistry, lodge_id)

  ###############################################################################
  ## INITIALIZATION BOILERPLATE

  def start_link(init) do
    GenServer.start_link(__MODULE__, init, name: via(init[:lodge_id]))
  end

  def init(init) do
    # adopt callers from the call point.
    Process.put(:"$callers", init[:callers])

    {:ok, struct(State, init)}
  end

  ########################################################################
  ## API

  def ws_fan(users, msg) do
    Enum.each(users, fn uid ->
      Pulse.UserSession.send_ws(uid, nil, msg)
    end)
  end

  def get(lodge_id, key), do: call(lodge_id, {:get, key})

  defp get_impl(key, _reply, state) do
    {:reply, Map.get(state, key), state}
  end

  def set(lodge_id, key, value), do: cast(lodge_id, {:set, key, value})

  defp set_impl(key, value, state) do
    {:noreply, Map.put(state, key, value)}
  end

  def broadcast_ws(lodge_id, msg), do: cast(lodge_id, {:broadcast_ws, msg})

  defp broadcast_ws_impl(msg, state) do
    ws_fan(state.users, msg)
    {:noreply, state}
  end

  def join_lodge(lodge_id, user_id, opts \\ []) do
    cast(lodge_id, {:join_lodge, user_id, opts})
  end

  defp join_lodge_impl(user_id, opts, state) do
    unless opts[:no_fan] do
      ws_fan(state.users, %{
        op: "new_user_join_lodge",
        d: %{
          user: Users.get_by_user_id(user_id),
          lodgeId: state.lodge_id
        }
      })
    end

    {:noreply,
     %{
       state
       | users: [
           # maybe use a set
           user_id
           | Enum.filter(state.users, fn uid -> uid != user_id end)
         ]
     }}
  end

  def destroy(lodge_id, user_id), do: cast(lodge_id, {:destroy, user_id})

  defp destroy_impl(user_id, state) do
    users = Enum.filter(state.users, fn uid -> uid != user_id end)

    ws_fan(users, %{
      op: "lodge_destroyed",
      d: %{lodgeId: state.lodge_id}
    })

    {:stop, :normal, state}
  end

  def leave_lodge(lodge_id, user_id), do: cast(lodge_id, {:leave_lodge, user_id})

  defp leave_lodge_impl(user_id, state) do
    users = Enum.reject(state.users, &(&1 == user_id))

    ws_fan(users, %{
      op: "user_left_lodge",
      d: %{userId: user_id, lodgeId: state.lodge_id}
    })

    new_state = %{
      state
      | users: users
    }

    # terminate lodge if it's empty
    case new_state.users do
      [] ->
        {:stop, :normal, new_state}

      _ ->
        {:noreply, new_state}
    end
  end

  ########################################################################
  ## ROUTER

  def handle_call({:get, key}, reply, state), do: get_impl(key, reply, state)

  def handle_cast({:set, key, value}, state), do: set_impl(key, value, state)

  def handle_cast({:broadcast_ws, msg}, state) do
    broadcast_ws_impl(msg, state)
  end

  def handle_cast({:join_lodge, user_id, opts}, state) do
    join_lodge_impl(user_id, opts, state)
  end

  def handle_cast({:destroy, user_id}, state) do
    destroy_impl(user_id, state)
  end

  def handle_cast({:leave_lodge, user_id}, state) do
    leave_lodge_impl(user_id, state)
  end
end
