defmodule Router do
  use Plug.Router

  alias Routes.GitlabAuth
  alias Routes.GithubAuth
  alias Routes.DevOnly

  plug(Plugs.Cors)
  plug(:match)
  plug(Plug.Parsers, parsers: [:json], json_decoder: Jason)
  plug(:dispatch)

  options _ do
    send_resp(conn, 200, "")
  end

  forward("/dev", to: DevOnly)
  forward("/auth/github", to: GithubAuth)
  forward("/auth/gitlab", to: GitlabAuth)

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
