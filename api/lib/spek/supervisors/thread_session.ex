defmodule Spek.Supervisors.ThreadSession do
  use Supervisor

  def start_link(init_args) do
    Supervisor.start_link(__MODULE__, init_args)
  end

  @impl true
  def init(_init_arg) do
    children = [
      {Registry, keys: :unique, name: Spek.ThreadSessionRegistry},
      {DynamicSupervisor, name: Spek.ThreadSessionDynamicSupervisor, strategy: :one_for_one}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
