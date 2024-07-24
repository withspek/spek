defmodule Pulse.DmSession do
  use GenServer, restart: :temporary

  alias Telescope.Users

  defmodule State do
    defstruct dm_id: "",
              users: []
  end

  #################################################################################
  # REGISTRY AND SUPERVISION BOILERPLATE

  defp via(user_id), do: {:via, Registry, {Pulse.DmSessionRegistry, user_id}}

  defp cast(user_id, params), do: GenServer.cast(via(user_id), params)
  defp call(user_id, params), do: GenServer.call(via(user_id), params)

  def start_supervised(initial_values) do
    callers = [self() | Process.get(:"$callers", [])]

    case DynamicSupervisor.start_child(
           Pulse.DmSessionDynamicSupervisor,
           {__MODULE__, Keyword.merge(initial_values, callers: callers)}
         ) do
      {:error, {:already_started, pid}} -> {:ignored, pid}
      error -> error
    end
  end

  def child_spec(init), do: %{super(init) | id: Keyword.get(init, :dm_id)}

  def count, do: Registry.count(Pulse.DmSessionRegistry)
  def lookup(dm_id), do: Registry.lookup(Pulse.DmSessionRegistry, dm_id)

  ###############################################################################
  ## INITIALIZATION BOILERPLATE

  def start_link(init) do
    GenServer.start_link(__MODULE__, init, name: via(init[:dm_id]))
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

  def get(dm_id, key), do: call(dm_id, {:get, key})

  defp get_impl(key, _reply, state) do
    {:reply, Map.get(state, key), state}
  end

  def set(user_id, key, value), do: cast(user_id, {:set, key, value})

  defp set_impl(key, value, state) do
    {:noreply, Map.put(state, key, value)}
  end

  def broadcast_ws(dm_id, msg), do: cast(dm_id, {:broadcast_ws, msg})

  defp broadcast_ws_impl(msg, state) do
    ws_fan(state.users, msg)
    {:noreply, state}
  end

  def join_dm(dm_id, user_id, opts \\ []) do
    cast(dm_id, {:join_dm, user_id, opts})
  end

  defp join_dm_impl(user_id, opts, state) do
    unless opts[:no_fan] do
      ws_fan(state.users, %{
        op: "new_user_join_dm",
        d: %{
          user: Users.get_by_user_id(user_id),
          dmId: state.dm_id
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

  def destroy(dm_id, user_id), do: cast(dm_id, {:destroy, user_id})

  defp destroy_impl(user_id, state) do
    users = Enum.filter(state.users, fn uid -> uid != user_id end)

    ws_fan(users, %{
      op: "dm_destroyed",
      d: %{dmId: state.dm_id}
    })

    {:stop, :normal, state}
  end

  def leave_dm(dm_id, user_id), do: cast(dm_id, {:leave_dm, user_id})

  defp leave_dm_impl(user_id, state) do
    users = Enum.reject(state.users, &(&1 == user_id))

    ws_fan(users, %{
      op: "user_left_dm",
      d: %{userId: user_id, dmId: state.dm_id}
    })

    new_state = %{
      state
      | users: users
    }

    # terminate dm if it's empty
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

  def handle_cast({:join_dm, user_id, opts}, state) do
    join_dm_impl(user_id, opts, state)
  end

  def handle_cast({:destroy, user_id}, state) do
    destroy_impl(user_id, state)
  end

  def handle_cast({:leave_dm, user_id}, state) do
    leave_dm_impl(user_id, state)
  end
end
