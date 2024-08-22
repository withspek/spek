defmodule Breeze.Routes.Public do
  use Plug.Router

  alias Breeze.Plugs
  alias Telescope.Confs

  plug(Plugs.CheckAuth, %{shouldThrow: false})
  plug(:match)
  plug(:dispatch)

  get "/confs/:community_id" do
    %Plug.Conn{params: %{"community_id" => community_id, "cursor" => cursor}} = conn

    user_id =
      if(Map.has_key?(conn.assigns, :user_id),
        do: conn.assigns.user_id,
        else: Ecto.UUID.autogenerate()
      )

    {confs, next_cursor} = Confs.get_top_public_confs(community_id, user_id, cursor)

    conn
    |> send_resp(200, Jason.encode!(%{nextCursor: next_cursor, confs: confs}))
  end

  match _ do
    conn
    |> send_resp(404, "not found")
  end
end
