defmodule Spek do
  use Application

  def start(_type, _args) do
    children = [
      Spek.Supervisors.UserSession,
      Spek.Repo,
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: Router,
        options: [port: String.to_integer(System.get_env("PORT") || "4001")]
      )
    ]

    opts = [strategy: :one_for_one, name: Spek.Supervisor]

    Supervisor.start_link(children, opts)
  end
end
