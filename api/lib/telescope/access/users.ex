defmodule Telescope.Access.Users do
  import Ecto.Query

  alias Telescope.Schemas.Conf
  alias Telescope.Queries.Users, as: Query
  alias Telescope.Repo
  alias Telescope.Schemas.User

  def get_by_user_id(user_id) do
    Query.start()
    |> Query.filter_by_id(user_id)
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
    |> where([u], ilike(u.username, ^search_str) or ilike(u.displayName, ^search_str))
    |> limit([], 15)
    |> Repo.all()
  end

  def get_users do
    Query.start()
    |> Repo.all()
  end

  def get_by_id_with_conf_permissions(user_id) do
    from(u in User,
      where: u.id == ^user_id,
      left_join: cp in Telescope.Schemas.ConfPermission,
      on: cp.user_id == u.id and cp.conf_id == u.current_conf_id,
      select: %{u | conf_permissions: cp},
      limit: 1
    )
    |> Repo.one()
  end

  def get_users_in_current_conf(user_id) do
    case tuple_get_current_conf_id(user_id) do
      {:ok, nil} ->
        {nil, []}

      {:ok, current_conf_id} ->
        {current_conf_id,
         from(u in User,
           where: u.current_conf_id == ^current_conf_id,
           left_join: cp in Telescope.Schemas.ConfPermission,
           on: cp.user_id == u.id and cp.conf_id == u.current_conf_id,
           select: %{u | conf_permissions: cp}
         )
         |> Repo.all()}

      _ ->
        {nil, []}
    end
  end

  def tuple_get_current_conf_id(user_id) do
    case Pulse.UserSession.get_current_conf_id(user_id) do
      {:ok, nil} ->
        {nil, nil}

      x ->
        {:ok, x}
    end
  end

  def get_by_id_with_current_conf(user_id) do
    from(u in User,
      left_join: a0 in assoc(u, :current_conf),
      where: u.id == ^user_id,
      limit: 1,
      preload: [current_conf: a0]
    )
    |> Repo.one()
  end

  def get_current_conf(user_id) do
    conf_id = get_current_conf_id(user_id)

    case conf_id do
      nil -> nil
      id -> Repo.get(Conf, id)
    end
  end

  def get_current_conf_id(user_id) do
    try do
      Pulse.UserSession.get_current_conf_id(user_id)
    catch
      _, _ ->
        case Repo.get(User, user_id) do
          nil -> nil
          %{current_conf_id: id} -> id
        end
    end
  end
end
