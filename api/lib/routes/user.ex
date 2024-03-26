defmodule Routes.User do
  alias Operations.Users
  use Plug.Router

  plug(Plugs.CheckAuth, %{shouldThrow: false})
  plug(:match)
  plug(:dispatch)

  get "/me" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      user = Users.get_user_id(conn.assigns.user_id)

      conn
      |> send_resp(200, Jason.encode!(%{"user" => user}))
    else
      IO.inspect(conn.assigns)

      conn
      |> send_resp(200, Jason.encode!(%{"user" => nil}))
    end
  end

  get "/:id" do
    %Plug.Conn{params: %{"id" => id}} = conn

    case Ecto.UUID.cast(id) do
      {:ok, uuid} ->
        user = Users.get_user_id(uuid)

        if is_nil(user) do
          conn
          |> send_resp(200, Jason.encode!(%{error: "user with this id does not exist"}))
        else
          conn
          |> send_resp(200, Jason.encode!(%{user: user}))
        end

      _ ->
        conn
        |> send_resp(200, Jason.encode!(%{error: "invalid user id"}))
    end
  end
end
