defmodule Breeze do
  use Plug.Router

  alias Breeze.Routes
  alias Breeze.Plugs

  plug(Plugs.Cors)
  plug(Spek.Metrics.PrometheusExporter)
  plug(:match)
  plug(Plug.Static, at: "/public", from: "/media")

  plug(Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Jason
  )

  plug(:dispatch)

  options _ do
    send_resp(conn, 200, "")
  end

  forward("/dev", to: Routes.DevOnly)
  forward("/auth", to: Routes.OAuth)

  # API V1 Routes
  forward("/community", to: Routes.V1.Communities)
  forward("/channels", to: Routes.V1.Channels)
  forward("/user", to: Routes.V1.Users)
  forward("/threads", to: Routes.V1.Threads)
  forward("/dms", to: Routes.V1.Dms)
  forward("/misc", to: Routes.Misc)
  forward("/admin", to: Routes.V1.Metrics)

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
