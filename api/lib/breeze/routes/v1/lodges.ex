defmodule Breeze.Routes.V1.Lodges do
  use Plug.Router

  alias Breeze.Plugs
  alias Telescope.Lodges

  plug(Plugs.CheckAuth, %{shouldThrow: false})
  plug(:match)
  plug(:dispatch)

  post "/create" do
    has_user_id = Map.has_key?(conn.assigns, :user_id)

    if has_user_id do
      data = %{
        owner_id: conn.assigns.user_id,
        recipients: conn.body_params["recipients"]
      }

      type = if length(data.recipients) > 2, do: 2, else: 1

      recipients = Lodges.get_lodge_recipients(data.recipients)

      {:ok, lodge} = Lodges.create_lodge(recipients, data.owner_id, type)

      conn
      |> send_resp(200, Jason.encode!(%{"lodge" => lodge}))
    else
      conn
      |> send_resp(402, Jason.encode!(%{error: "Missing Auth credentials"}))
    end
  end

  match _ do
    conn
    |> send_resp(404, "Not found")
  end
end
