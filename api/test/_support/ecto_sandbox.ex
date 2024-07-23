defmodule SpekTest.Support.EctoSandbox do
  defmacro __using__(_) do
    quote do
      def checkout_ecto_sandbox(tags) do
        :ok = Ecto.Adapters.SQL.Sandbox.checkout(Telescope.Repo)

        unless tags[:async] do
          Ecto.Adapters.SQL.Sandbox.mode(Telescope.Repo, {:shared, self()})
        end

        :ok
      end

      setup :checkout_ecto_sandbox
    end
  end
end
