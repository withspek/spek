defmodule Operations.Access.Users do
  import Ecto.Query
  alias Spek.Repo
  alias Models.User

  def get_user_id(user_id) do
    IO.inspect(user_id)
  end

  def get_by_username(username) do
    from(u in User, where: u.username == ^username, limit: 1) |> Repo.one()
  end

  def get_users do
    query =
      from(u in User)
      |> Repo.all([])

    query
  end
end
