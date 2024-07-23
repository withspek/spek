defmodule BreezeTest.WsClient do
  use WebSockex

  require ExUnit.Assertions
  alias Ecto.UUID

  @api_url Application.compile_env(:spek, :api_url)

  def child_spec(info) do
    # make the id be a random uuid
    info
    |> super
    |> Map.put(:id, UUID.autogenerate())
  end

  def start_link(_opts) do
    ancestors =
      :"$ancestors"
      |> Process.get()
      |> :erlang.term_to_binary()
      |> Base.encode16()

    @api_url
    |> Path.join("ws")
    |> WebSockex.start_link(__MODULE__, nil,
      extra_headers: [{"user-agent", ancestors}, {"x-forwarded-for", "127.0.0.1"}]
    )
  end

  ########################################################
  # API

  def send_call(client_ws, op, payload) do
    call_ref = UUID.autogenerate()

    WebSockex.cast(client_ws, {:send, %{"op" => op, "d" => payload, "fetchId" => call_ref}})
  end

  def do_call(ws, op, payload) do
    ref = send_call(ws, op, payload)

    receive do
      {:text, %{"op" => _, "fetchId" => ^ref, "d" => payload}, ^ws} ->
        payload
    after
      100 ->
        raise "reply to `#{op} not received`"
    end
  end

  def send_msg(client_ws, op, payload),
    do: WebSockex.cast(client_ws, {:send, %{"op" => op, "d" => payload}})

  def send_msg_impl(map, test_pid) do
    {:reply, {:text, Jason.encode!(map)}, test_pid}
  end

  def forward_frames(client_ws), do: WebSockex.cast(client_ws, {:forward_frames, self()})
  defp forward_frames_impl(test_pid, _state), do: {:ok, test_pid}

  defmacro assert_frame(op, payload, from \\ nil) do
    if from do
      quote do
        from = unquote(from)

        ExUnit.Assertions.assert_receive(
          {:text, %{"op" => unquote(op), "d" => unquote(payload)}, ^from}
        )
      end
    else
      quote do
        ExUnit.Assertions.assert_receive(
          {:text, %{"op" => unquote(op), "d" => unquote(payload)}, _}
        )
      end
    end
  end

  defmacro assert_reply(ref, payload, from \\ nil) do
    if from do
      quote do
        from = unquote(from)
        ref = unquote(ref)

        ExUnit.Assertions.assert_receive(
          {:text, %{"op" => "fetch_done", "d" => unquote(payload), "fetchId" => ^ref}, ^from}
        )
      end
    else
      quote do
        ExUnit.Assertions.assert_receive(
          {:text, %{"op" => "fetch_done", "d" => unquote(payload), "fetchId" => ^ref}, _}
        )
      end
    end
  end

  defmacro assert_dies(client_ws, fun, reason, timeout \\ 100) do
    quote bind_quoted: [client_ws: client_ws, fun: fun, reason: reason, timeout: timeout] do
      Process.flag(:trap_exit, true)
      Process.link(client_ws)
      fun.()
      ExUnit.Assertions.assert_receive({:EXIT, ^client_ws, ^reason}, timeout)
    end
  end

  defmacro refute_frame(op, from) do
    quote do
      from = unquote(from)
      ExUnit.Assertions.refute_receive({:text, %{"op" => unquote(op)}, ^from})
    end
  end

  ###############################################################
  # ROUTER

  @impl true
  def handle_frame({type, data}, test_pid) do
    send(test_pid, {type, Jason.decode!(data), self()})
    {:ok, test_pid}
  end

  @impl true
  def handle_cast({:send, map}, test_pid), do: send_msg_impl(map, test_pid)
  def handle_cast({:forward_frames, test_pid}, state), do: forward_frames_impl(test_pid, state)
end

defmodule BreezeTest.WsClientFactory do
  require BreezeTest.WsClient
  alias Telescope.Schemas.User
  alias BreezeTest.WsClient
  alias Spek.Utils

  import ExUnit.Assertions

  # note that this function ALSO causes the calling process to be subscribed
  # to forwarded messages from the websocket client.

  def create_client_for(user = %User{}) do
    tokens = Utils.TokenUtils.create_tokens(user)

    # start and link the websocket client
    client_ws = ExUnit.Callbacks.start_link_supervised!(WsClient)
    WsClient.forward_frames(client_ws)

    WsClient.send_msg(client_ws, "auth", %{
      "accessToken" => tokens.accessToken,
      "refreshToken" => tokens.refreshToken,
      "platform" => "foo"
    })

    WsClient.assert_frame("auth-good", _)

    # link the UserProcess to prevent dangling DB sandbox loopup
    [{usersession_pid, _}] = Registry.lookup(Pulse.UserSessionRegistry, user.id)
    # associate the user session with the database
    Process.link(usersession_pid)

    client_ws
  end
end
