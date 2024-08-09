defmodule Telescope.Queries.Confs do
  import Ecto.Query
  alias Telescope.Schemas.User
  alias Telescope.Schemas.Conf

  def start do
    from(c in Conf)
  end

  def user_start do
    from(u in User)
  end

  def filter_by_current_conf_id(query, conf_id) do
    where(query, [u], u.current_conf_id == ^conf_id)
  end

  def filter_by_creator_id(query, creator_id) do
    where(query, [c], c.creator_id == ^creator_id)
  end

  def filter_by_conf_id_and_creator_id(query, conf_id, user_id) do
    where(query, [c], c.id == ^conf_id and c.creator_id == ^user_id)
  end

  def limit_one(query) do
    limit(query, [c], 1)
  end
end
