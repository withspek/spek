defmodule Router do
  use Plug.Router

  alias Routes.GitlabAuth
  alias Routes.GithubAuth
  alias Routes.DevOnly

  plug(Plugs.Cors)
  plug(:match)
  plug(Plug.Parsers, parsers: [:json], pass: ["application/json"], json_decoder: Jason)
  plug(:dispatch)

  options _ do
    send_resp(conn, 200, "")
  end

  forward("/dev", to: DevOnly)
  forward("/auth/github", to: GithubAuth)
  forward("/auth/gitlab", to: GitlabAuth)

  # API Routes
  forward("/community", to: Routes.Community)
  forward("/user", to: Routes.User)
  forward("/threads", to: Routes.Threads)

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
