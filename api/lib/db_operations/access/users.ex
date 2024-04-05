defmodule Operations.Access.Users do
  import Ecto.Query
  alias Spek.Repo
  alias Models.User

  def get_user_id(user_id) do
    from(u in User, where: u.id == ^user_id, limit: 1) |> Repo.one()
  end

  def get_by_username(username) do
    from(u in User, where: u.username == ^username, limit: 1) |> Repo.one()
  end

  def search_username(<<first_letter>> <> rest) when first_letter == ?@ do
    search_username(rest)
  end

  def search_username(start_of_username) do
    search_str = start_of_username <> "%"

    from(u in User)
    |> where([u], ilike(u.username, ^search_str))
    |> limit([], 15)
    |> Repo.all()
  end

  def get_users do
    query =
      from(u in User)
      |> Repo.all([])

    query
  end
end
