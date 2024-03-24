defmodule Spek do
  use Application

  def start(_type, _args) do
    children = [
      Spek.Supervisors.UserSession,
      Spek.Supervisors.CommunitySession,
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
        start_communities()
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

  defp start_communities() do
    Enum.each(Operations.Communities.all_communities(), fn community ->
      members = Operations.Communities.get_community_members(community.id)
      users = Enum.map(members, fn x -> x.id end)

      Spek.CommunitySession.start_supervised(
        community_id: community.id,
        community_creator_id: community.ownerId,
        users: users
      )
    end)
  end
end
