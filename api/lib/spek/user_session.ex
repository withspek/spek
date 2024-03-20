defmodule Spek.UserSesion do
  use GenServer

  defmodule State do
    defstruct user_id: nil,
              pid: nil
  end

  def start_link(%State{
        user_id: user_id
      }) do
    GenServer.start_link(
      __MODULE__,
      %State{
        pid: nil,
        user_id: user_id
      },
      name: :"#{user_id}:user_session"
    )
  end

  def init(x) do
    {:ok, x}
  end

  def send_call!(user_id, params) do
    case send_call(user_id, params) do
      {:ok, x} ->
        x

      _ ->
        nil
    end
  end

  def send_call(user_id, params) do
    case GenRegistry.looup(Spek.UserSesion, user_id) do
      {:ok, session} ->
        GenServer.cast(session, params)

      err ->
        err
    end
  end

  def handle_cast({:set, key, value}, state) do
    {:noreply, Map.put(state, key, value)}
  end

  def handle_cast({:send_ws_msg, _platform, msg}, state) do
    if not is_nil(state.pid) do
      send(state.pid, {:remote_send, msg})
    end

    {:noreply, state}
  end

  def handle_cast({:new_tokens, tokens}, state) do
    if not is_nil(state.pid) do
      send(state.pid, {:remote_send, %{op: "new-tokens", d: tokens}})
    end

    {:noreply, state}
  end

  def handle_call({:set_pid, pid}, _from, state) do
    if not is_nil(state.pid) do
      send(state.pid, {:kill})
    else
      # TODO: Set that the user is online
    end

    Process.monitor(pid)
    {:reply, :ok, %{state | pid: pid}}
  end

  def handle_info({:DOWN, _ref, :process, pid, _reason}, state) do
    if state.pid === pid do
      # TODO: SET USER OFFLINE

      {:stop, :normal, state}
    else
      {:noreply, state}
    end
  end
end
