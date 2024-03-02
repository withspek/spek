defmodule Spek do
  use Application

  def start(_type, _args) do
    children = [
      Plug.Cowboy.child_spec(scheme: :http, plug: Router, options: [port: 4001]),
      Spek.Repo
    ]

    opts = [strategy: :one_for_one, name: Spek.Supervisor]

    Supervisor.start_link(children, opts)
  end
end
