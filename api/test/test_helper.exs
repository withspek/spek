ExUnit.start()
Ecto.Adapters.SQL.Sandbox.mode(Telescope.Repo, :manual)

# start up a process pool for making requests
Finch.start_link(name: BreezeHttpRequests)
