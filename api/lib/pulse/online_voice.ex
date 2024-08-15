defmodule Pulse.OnlineVoice do
  @moduledoc """
  Used to alert the Elixir server when the Voice server starts up for the first time
  """
  use GenServer, restart: :temporary
  use AMQP

  defmodule State do
    defstruct id: "", chan: nil
  end

  def start_supervised(voice_id) do
    DynamicSupervisor.start_child(
      Pulse.OnlineVoiceDynamicSupervisor,
      {__MODULE__, voice_id}
    )
  end

  def start_link(voice_id) do
    GenServer.start_link(
      __MODULE__,
      voice_id,
      name: via(voice_id)
    )
  end

  defp via(voice_id), do: {:via, Registry, {Pulse.OnlineVoiceRegistry, voice_id}}

  @online_exchange "spek_online_exchange"
  @online_receive_queue "spek_online_queue"

  def init(voice_id) do
    rabbitmq_connect(voice_id)
  end

  defp rabbitmq_connect(voice_id) do
    case Connection.open(Application.get_env(:spek, :rabbit_url, "amqp://guest:guest@localhost")) do
      {:ok, conn} ->
        {:ok, chan} = Channel.open(conn)
        setup_queue(voice_id, chan)

        :ok = Basic.qos(chan, prefetch_count: 1)
        queue_to_consume = @online_receive_queue <> voice_id
        IO.puts("queue_to_consume_online: " <> queue_to_consume)
        # Register the GenServer process as a consumer
        {:ok, _consumer_tag} = Basic.consume(chan, queue_to_consume, nil, no_ack: true)

        {:ok, %State{chan: chan, id: voice_id}}

      {:error, _} ->
        # Reconnection loop
        :timer.sleep(10000)
        rabbitmq_connect(voice_id)
    end
  end

  def handle_info({:basic_consume_ok, %{consumer_tag: _consume_tag}}, state) do
    {:noreply, state}
  end

  # Sent by the broker when the consumer is unexpectedly cancelled (such as after a queue deletion)
  def handle_info({:basic_cancel, %{consumer_tag: _consume_tag}}, state) do
    {:stop, :normal, state}
  end

  # Confirmation sent by the broker to the consumer process after a Basic.cancel
  def handle_info({:basic_cancel_ok, %{consumer_tag: _consumer_tag}}, state) do
    {:noreply, state}
  end

  def handle_info(
        {:basic_deliver, payload, %{delivery_tag: _tag, redelivered: _redelivered}},
        %State{} = state
      ) do
    case Jason.decode!(payload) do
      %{"op" => "online"} ->
        Pulse.UserSession.force_reconnects(state.id)

      _ ->
        :ok
    end

    # You might want to run payload consumption in separate Tasks in production
    # consume(chan, tag, redelivered, payload)
    {:noreply, state}
  end

  defp setup_queue(id, chan) do
    {:ok, _} = Queue.declare(chan, @online_receive_queue <> id, durable: true)

    :ok = Exchange.fanout(chan, @online_exchange <> id, durable: true)
    :ok = Queue.bind(chan, @online_receive_queue <> id, @online_exchange)
  end
end
