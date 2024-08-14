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
              auto_speaker: false
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
  def lookup(conf_id), do: Registry.lookup(Pulse.ConfSessionRegistry, conf_id)

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
    {:reply, {state.mute_map, state.deaf_map, state.auto_speaker, state.active_speaker_map},
     state}
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

  def redeem_invite(conf_id, user_id), do: call(conf_id, {:redeem_invite, user_id})

  defp redeem_invite_impl(user_id, _reply, state) do
    reply = if Map.has_key?(state.inviteMap, user_id), do: :ok, else: :error

    {:reply, reply, %{state | invite_map: Map.delete(state.inviteMap, user_id)}}
  end

  def speaking_change(conf_id, user_id, value) do
    cast(conf_id, {:speaking_change, user_id, value})
  end

  defp speaking_change_impl(user_id, value, state) when is_boolean(value) do
    muteMap = if value, do: Map.delete(state.mute_map, user_id), else: state.mute_map
    deafMap = if value, do: Map.delete(state.deaf_map, user_id), else: state.deaf_map

    newActiveSpeakerMap =
      if value,
        do: Map.put(state.active_speaker_map, user_id, true),
        else: Map.delete(state.active_speaker_map, user_id)

    ws_fan(state.users, %{
      op: "active_speaker_change",
      confId: state.conf_id,
      muteMap: muteMap,
      deafMap: deafMap
    })

    {:noreply, %State{state | active_speaker_map: newActiveSpeakerMap}}
  end

  def set_conf_creator_id(conf_id, id) do
    cast(conf_id, {:set_conf_creator_id, id})
  end

  defp set_conf_creator_id_impl(id, %State{} = state) do
    {:noreply, %{state | conf_creator_id: id}}
  end

  def set_auto_speaker(conf_id, value) when is_boolean(value) do
    cast(conf_id, {:set_auto_speaker, value})
  end

  defp set_auto_speaker_impl(value, state) do
    {:noreply, %{state | auto_speaker: value}}
  end

  def create_invite(conf_id, user_id, user_info) do
    cast(conf_id, {:create_invite, user_id, user_info})
  end

  defp create_invite_impl(user_id, user_info, state) do
    Pulse.UserSession.send_ws(user_id, nil, %{
      op: "invitation_to_conf",
      d: Map.merge(%{confId: state.conf_id}, user_info)
    })
  end

  def remove_speaker(conf_id, user_id), do: cast(conf_id, {:remove_speaker, user_id})

  defp remove_speaker_impl(user_id, state) do
    new_mute_map = Map.delete(state.mute_map, user_id)
    new_deaf_map = Map.delete(state.deaf_map, user_id)

    Pulse.Voice.send(state.voice_server_id, %{
      op: "remove_speaker",
      d: %{confId: state.conf_id, peerId: user_id},
      uid: user_id
    })

    ws_fan(state.users, %{
      op: "speaker_removed",
      d: %{
        userId: user_id,
        confId: state.conf_id,
        muteMap: new_mute_map,
        deafMap: new_deaf_map,
        raiseHandMap: %{}
      }
    })

    {:noreply, %State{state | mute_map: new_mute_map, deaf_map: new_deaf_map}}
  end

  def add_speaker(conf_id, user_id, muted?, deafened?)
      when is_boolean(muted?) and is_boolean(deafened?) do
    cast(conf_id, {:add_speaker, user_id, muted?, deafened?})
  end

  def add_speaker_impl(user_id, muted?, deafened?, state) do
    new_mute_map =
      if muted?,
        do: Map.put(state.mute_map, user_id, true),
        else: Map.delete(state.deaf_map, user_id)

    new_deaf_map =
      if deafened?,
        do: Map.put(state.deaf_map, user_id, true),
        else: Map.delete(state.deaf_map, user_id)

    Pulse.Voice.send(state.voice_server_id, %{
      op: "add-speaker",
      d: %{confId: state.conf_id, peerId: user_id},
      uid: user_id
    })

    ws_fan(state.users, %{
      op: "speaker_added",
      d: %{
        userId: user_id,
        confId: state.conf_id,
        muteMap: new_mute_map,
        deafMap: new_deaf_map
      }
    })

    {:noreply, %State{state | mute_map: new_mute_map, deaf_map: new_deaf_map}}
  end

  def join_conf(conf_id, user_id, mute, deaf, opts \\ []) do
    cast(conf_id, {:join_conf, user_id, mute, deaf, opts})
  end

  defp join_conf_impl(user_id, mute, deaf, opts, state) do
    muteMap =
      case mute do
        nil -> state.mute_map
        true -> Map.put(state.mute_map, user_id, true)
        false -> Map.delete(state.mute_map, user_id)
      end

    deafMap =
      case deaf do
        nil -> state.deaf_map
        true -> Map.put(state.deaf_map, user_id, true)
        false -> Map.delete(state.deaf_map, user_id)
      end

    unless opts[:no_fan] do
      ws_fan(state.users, %{
        op: "new_user_join_conf",
        d: %{
          user: Telescope.Users.get_by_id_with_conf_permissions(user_id),
          muteMap: muteMap,
          deafMap: deafMap,
          confId: state.conf_id
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
         ],
         mute_map: muteMap,
         deaf_map: deafMap
     }}
  end

  def mute(conf_id, user_id, value), do: cast(conf_id, {:mute, user_id, value})

  defp mute_impl(user_id, value, state) do
    changed = value != Map.has_key?(state.mute_map, user_id)

    if changed do
      ws_fan(Enum.filter(state.users, &(&1 != user_id)), %{
        op: "mute_changed",
        d: %{userId: user_id, value: value, confId: state.conf_id}
      })
    end

    {:noreply,
     %{
       state
       | mute_map:
           if(not value,
             do: Map.delete(state.mute_map, user_id),
             else: Map.put(state.mute_map, user_id, true)
           ),
         active_speaker_map:
           if(value,
             do: Map.delete(state.active_speaker_map, user_id),
             else: state.active_speaker_map
           ),
         deaf_map:
           if(value,
             do: Map.delete(state.deaf_map, user_id),
             else: state.deaf_map
           )
     }}
  end

  def deafen(conf_id, user_id, value), do: cast(conf_id, {:deafen, user_id, value})

  defp deafen_impl(user_id, value, state) do
    changed = value != Map.has_key?(state.deaf_map, user_id)

    if changed do
      ws_fan(Enum.filter(state.users, &(&1 != user_id)), %{
        op: "deafen_changed",
        d: %{userId: user_id, value: value, confId: state.conf_id}
      })
    end

    {:noreply,
     %{
       state
       | deaf_map:
           if(not value,
             do: Map.delete(state.deaf_map, user_id),
             else: Map.put(state.deaf_map, user_id, true)
           ),
         active_speaker_map:
           if(value,
             do: Map.delete(state.active_speaker_map, user_id),
             else: state.active_speaker_map
           ),
         mute_map:
           if(value,
             do: Map.delete(state.mute_map, user_id),
             else: state.mute_map
           )
     }}
  end

  def destroy(conf_id, user_id), do: cast(conf_id, {:destroy, user_id})

  defp destroy_impl(user_id, state) do
    users = Enum.filter(state.users, fn uid -> uid != user_id end)

    ws_fan(users, %{
      op: "conf_destroyed",
      d: %{confId: state.conf_id}
    })

    {:stop, :normal, state}
  end

  def leave_conf(conf_id, user_id), do: cast(conf_id, {:leave_conf, user_id})

  defp leave_conf_impl(user_id, state) do
    users = Enum.reject(state.users, &(&1 == user_id))

    Pulse.Voice.send(state.voice_server_id, %{
      op: "close-peer",
      uid: user_id,
      d: %{peerId: user_id, confId: state.conf_id}
    })

    ws_fan(users, %{
      op: "user_left_conf",
      d: %{userId: user_id, confId: state.conf_id}
    })

    new_state = %{
      state
      | users: users,
        mute_map: Map.delete(state.mute_map, user_id),
        deaf_map: Map.delete(state.deaf_map, user_id)
    }

    # terminate conf if it's empty
    case new_state.users do
      [] ->
        {:stop, :normal, new_state}

      _ ->
        {:noreply, new_state}
    end
  end

  ## ROUTER

  def handle_call({:get, key}, reply, state), do: get_impl(key, reply, state)

  def handle_call(:get_maps, reply, state), do: get_maps_impl(reply, state)

  def handle_call({:redeem_invite, user_id}, reply, state) do
    redeem_invite_impl(user_id, reply, state)
  end

  def handle_cast({:set, key, value}, state), do: set_impl(key, value, state)

  def handle_cast({:broadcast_ws, msg}, state) do
    broadcast_ws_impl(msg, state)
  end

  def handle_cast({:speaking_change, user_id, value}, state) do
    speaking_change_impl(user_id, value, state)
  end

  def handle_cast({:set_conf_creator_id, id}, state) do
    set_conf_creator_id_impl(id, state)
  end

  def handle_cast({:set_auto_speaker, value}, state) do
    set_auto_speaker_impl(value, state)
  end

  def handle_cast({:create_invite, user_id, user_info}, state) do
    create_invite_impl(user_id, user_info, state)
  end

  def handle_cast({:remove_speaker, user_id}, state) do
    remove_speaker_impl(user_id, state)
  end

  def handle_cast({:add_speaker, user_id, muted?, deafened?}, state) do
    add_speaker_impl(user_id, muted?, deafened?, state)
  end

  def handle_cast({:join_conf, user_id, mute, deaf, opts}, state) do
    join_conf_impl(user_id, mute, deaf, opts, state)
  end

  def handle_cast({:mute, user_id, value}, state) do
    mute_impl(user_id, value, state)
  end

  def handle_cast({:deafen, user_id, value}, state) do
    deafen_impl(user_id, value, state)
  end

  def handle_cast({:destroy, user_id}, state) do
    destroy_impl(user_id, state)
  end

  def handle_cast({:leave_conf, user_id}, state) do
    leave_conf_impl(user_id, state)
  end
end
