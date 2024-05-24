defmodule Router do
  use Plug.Router

  alias Routes.GitlabAuth
  alias Routes.GithubAuth
  alias Routes.DevOnly

  plug(Plugs.Cors)
  plug(:match)
  plug(Plug.Static, at: "/public", from: "/media")

  plug(Plug.Parsers,
    parsers: [:json, :urlencoded, {:multipart, length: 20_000_000}],
    pass: ["application/json", "text/*"],
    json_decoder: Jason
  )

  plug(:dispatch)

  options _ do
    send_resp(conn, 200, "")
  end

  forward("/dev", to: DevOnly)
  forward("/auth/github", to: GithubAuth)
  forward("/auth/gitlab", to: GitlabAuth)

  # API Routes
  forward("/community", to: Routes.Community)
  forward("/channels", to: Routes.Channels)
  forward("/user", to: Routes.User)
  forward("/threads", to: Routes.Threads)
  forward("/dms", to: Routes.Dms)
  forward("/misc", to: Routes.Misc)
  forward("/admin", to: Routes.Admin)

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
