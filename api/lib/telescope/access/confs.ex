defmodule Telescope.Access.Confs do
  import Ecto.Query
  @fetch_limit 16

  alias Telescope.Queries.Confs, as: Query
  alias Telescope.Users
  alias Telescope.Repo
  alias Telescope.Schemas.User
  alias Telescope.Schemas.Conf
  alias Telescope.Schemas.ConfPermission
  alias Telescope.ConfPermissions

  def get_conf_status(user_id) do
    conf = Users.get_current_conf(user_id)

    cond do
      is_nil(conf) ->
        {nil, nil}

      conf.creator_id == user_id ->
        {:creator, conf}

      true ->
        status =
          case ConfPermissions.get_conf_perms(user_id, conf.id) do
            %{is_mod: true} -> :mod
            %{is_speaker: true} -> :speaker
            %{asked_to_speak: true} -> :asked_to_speak
            _ -> :listener
          end

        {status, conf}
    end
  end

  def all_confs() do
    Repo.all(Conf)
  end

  def search_name(start_of_name) do
    search_str = start_of_name <> "%"

    Query.start()
    |> where([c], ilike(c.name, ^search_str) and c.is_private == false)
    |> order_by([c], desc: c.num_people_inside)
    |> limit([], 15)
    |> Repo.all()
  end

  def owner?(conf_id, user_id) do
    not is_nil(
      Query.start()
      |> Query.filter_by_conf_id_and_creator_id(conf_id, user_id)
      |> Repo.one()
    )
  end

  def get_a_user_for_conf(conf_id) do
    Query.user_start()
    |> Query.filter_by_current_conf_id(conf_id)
    |> Query.limit_one()
    |> Repo.one()
  end

  def get_conf_by_creator_id(creator_id) do
    Query.start()
    |> Query.filter_by_creator_id(creator_id)
    |> Query.limit_one()
    |> Repo.one()
  end

  def can_join_conf(conf_id, _user_id) do
    conf = get_conf_by_id(conf_id)
    max_conf_size = Application.fetch_env!(:spek, :max_conf_size)

    case conf do
      nil ->
        {:error, "conf doesn't exist anymore"}

      _ ->
        cond do
          conf.num_people_inside >= max_conf_size ->
            {:error, "conf is full"}

          true ->
            {:ok, conf}
        end
    end
  end

  def get_conf_by_id(conf_id) do
    Repo.get(Conf, conf_id)
  end

  def get_top_public_confs(community_id, _user_id, offset \\ 0) do
    max_conf_size = Application.fetch_env!(:spek, :max_conf_size)

    items =
      from(c in Conf,
        where:
          c.is_private == false and
            c.num_people_inside < ^max_conf_size and c.community_id == ^community_id,
        order_by: [desc: c.num_people_inside],
        offset: ^offset,
        limit: ^@fetch_limit
      )
      |> Repo.all()

    {Enum.slice(items, 0, -1 + @fetch_limit),
     if(length(items) == @fetch_limit, do: -1 + offset + @fetch_limit, else: nil)}
  end

  @user_order """
    (case
      when ? then 1
      else 2
    end)
  """
  def get_next_creator_for_conf(conf_id) do
    from(u in User,
      inner_join: cp in ConfPermission,
      on: cp.conf_id == ^conf_id and cp.user_id == u.id and u.current_conf_id == ^conf_id,
      where: cp.is_speaker == true,
      limit: 1,
      order_by: [
        asc: fragment(@user_order, cp.is_mod)
      ]
    )
    |> Repo.one()
  end
end
