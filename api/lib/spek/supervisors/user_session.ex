defmodule Spek.Supervisors.UserSession do
  use Supervisor

  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg)
  end

  @impl true
  def init(_init_arg) do
    children = [
      {Registry, keys: :unique, name: Spek.UserSesionRegistry},
      {DynamicSupervisor, name: Onion.UserSesionDynamicSupervisor, start: :one_for_one}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
