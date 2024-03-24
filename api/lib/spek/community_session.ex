defmodule Spek.CommunitySession do
  use GenServer, restart: :temporary

  defmodule State do
    defstruct community_id: "",
              community_creator_id: "",
              users: []
  end

  #################################################################################
  # REGISTRY AND SUPERVISION BOILERPLATE

  defp via(user_id), do: {:via, Registry, {Spek.CommunitySessionRegistry, user_id}}

  defp cast(user_id, params), do: GenServer.cast(via(user_id), params)
  defp call(user_id, params), do: GenServer.call(via(user_id), params)

  def start_supervised(initial_values) do
    callers = [self() | Process.get(:"$callers", [])]

    case DynamicSupervisor.start_child(
           Spek.CommunitySessionDynamicSupervisor,
           {__MODULE__, Keyword.merge(initial_values, callers: callers)}
         ) do
      {:error, {:already_started, pid}} -> {:ignored, pid}
      error -> error
    end
  end

  def child_spec(init), do: %{super(init) | id: Keyword.get(init, :community_id)}

  def count, do: Registry.count(Spek.CommunitySessionRegistry)
  def lookup(community_id), do: Registry.lookup(Spek.CommunitySessionRegistry, community_id)

  ###############################################################################
  ## INITIALIZATION BOILERPLATE

  def start_link(init) do
    GenServer.start_link(__MODULE__, init, name: via(init[:community_id]))
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
      Spek.UserSession.send_ws(uid, nil, msg)
    end)
  end

  def get(community_id, key), do: call(community_id, {:get, key})

  defp get_impl(key, _reply, state) do
    {:reply, Map.get(state, key), state}
  end

  def set(user_id, key, value), do: cast(user_id, {:set, key, value})

  defp set_impl(key, value, state) do
    {:noreply, Map.put(state, key, value)}
  end

  def broadcast_ws(community_id, msg), do: cast(community_id, {:broadcast_ws, msg})

  defp broadcast_ws_impl(msg, state) do
    IO.inspect(state.users)
    ws_fan(state.users, msg)
    {:noreply, state}
  end

  def join_community(community_id, user_id, opts \\ []) do
    cast(community_id, {:join_community, user_id, opts})
  end

  defp join_community_impl(user_id, opts, state) do
    unless opts[:no_fan] do
      ws_fan(state.users, %{
        op: "new_user_join_community",
        d: %{
          user: Operations.Users.get_user_id(user_id),
          communityId: state.community_id
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

  def destroy(community_id, user_id), do: cast(community_id, {:destroy, user_id})

  defp destroy_impl(user_id, state) do
    users = Enum.filter(state.users, fn uid -> uid != user_id end)

    ws_fan(users, %{
      op: "community_destroyed",
      d: %{communityId: state.community_id}
    })

    {:stop, :normal, state}
  end

  def leave_community(community_id, user_id), do: cast(community_id, {:leave_community, user_id})

  defp leave_community_impl(user_id, state) do
    users = Enum.reject(state.users, &(&1 == user_id))

    ws_fan(users, %{
      op: "user_left_community",
      d: %{userId: user_id, communityId: state.community_id}
    })

    new_state = %{
      state
      | users: users
    }

    # terminate community if it's empty
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

  def handle_cast({:join_community, user_id, opts}, state) do
    join_community_impl(user_id, opts, state)
  end

  def handle_cast({:destroy, user_id}, state) do
    destroy_impl(user_id, state)
  end

  def handle_cast({:leave_community, user_id}, state) do
    leave_community_impl(user_id, state)
  end
end
