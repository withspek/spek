defmodule Spek do
  use Application

  def start(_type, _args) do
    children = [
      Spek.Supervisors.UserSession,
      Spek.Supervisors.ThreadSession,
      Spek.Supervisors.DmSession,
      {Spek.Repo, []},
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: Router,
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
        start_dms()
        start_threads()
        {:ok, pid}

      error ->
        error
    end
  end

  defp dispatch do
    [
      {:_,
       [
         {"/ws", SocketHandler, []},
         {:_, Plug.Cowboy.Handler, {Router, []}}
       ]}
    ]
  end

  defp start_dms() do
    Enum.each(Operations.Dms.all_dms_ids(), fn id ->
      Spek.DmSession.start_supervised(dm_id: id)
    end)
  end

  defp start_threads() do
    Enum.each(Operations.Communities.all_threads_ids(), fn id ->
      Spek.ThreadSession.start_supervised(thread_id: id)
    end)
  end
end
