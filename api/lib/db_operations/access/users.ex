defmodule Operations.Access.Users do
  import Ecto.Query

  alias Operations.Queries.Users, as: Query
  alias Spek.Repo
  alias Models.User

  def get_user_id(user_id) do
    Query.start()
    |> Query.filter_by_id(user_id)
    |> Query.thread_sub_info(user_id)
    |> Query.limit_one()
    |> Repo.one()
  end

  def get_by_username(username) do
    Query.start()
    |> Query.filter_by_username(username)
    |> Query.limit_one()
    |> Repo.one()
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
    Query.start()
    |> Repo.all()
  end
end
