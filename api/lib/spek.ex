defmodule Spek do
  use Application

  # start vm
  def start(_type, _args) do
    Spek.Metrics.PrometheusExporter.setup()
    Spek.Metrics.PipelineInstrumenter.setup()
    Spek.Metrics.UserSessions.setup()

    children = [
      Pulse.Supervisors.UserSession,
      Pulse.Supervisors.ThreadSession,
      Pulse.Supervisors.LodgeSession,
      Pulse.Supervisors.OnliceVoice,
      Pulse.Supervisors.Voice,
      {Telescope.Repo, []},
      Pulse.Telemetry,
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: Breeze,
        options: [
          port: String.to_integer(System.get_env("PORT") || "4001"),
          dispatch: dispatch(),
          protocol_options: [idle_timeout: :infinity]
        ]
      )
    ]

    opts = [strategy: :one_for_one, name: Spek.Supervisor]

    # TODO: make these into tasks

    case Supervisor.start_link(children, opts) do
      {:ok, pid} ->
        start_lodges()
        start_threads()
        start_rabbits()
        {:ok, pid}

      error ->
        error
    end
  end

  defp dispatch do
    [
      {:_,
       [
         {"/ws", Breeze.SocketHandler, []},
         {:_, Plug.Cowboy.Handler, {Breeze, []}}
       ]}
    ]
  end

  defp start_lodges() do
    Enum.each(Telescope.Lodges.get_all_lodges_ids(), fn id ->
      Pulse.LodgeSession.start_supervised(lodge_id: id)
    end)
  end

  defp start_threads() do
    Enum.each(Telescope.Communities.all_threads_ids(), fn id ->
      Pulse.ThreadSession.start_supervised(thread_id: id)
    end)
  end

  defp start_rabbits() do
    n = Application.get_env(:spek, :num_voice_servers, 1) - 1

    IO.puts("about to start_rabbits")

    0..n
    |> Enum.map(&Spek.Utils.VoiceServerUtils.idx_to_str_id/1)
    |> Enum.each(fn id ->
      Pulse.Voice.start_supervised(id)
      Pulse.OnlineVoice.start_supervised(id)
    end)

    IO.puts("finished rabbits")
  end
end
