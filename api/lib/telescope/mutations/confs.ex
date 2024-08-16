defmodule Telescope.Mutations.Confs do
  import Ecto.Query

  alias Telescope.Confs
  alias Telescope.Schemas.Conf
  alias Telescope.Schemas.User
  alias Telescope.Repo
  alias Telescope.Users

  def raw_insert(data, people_preview_list) do
    %Conf{people_preview_list: people_preview_list}
    |> Conf.insert_changeset(data)
    |> Repo.insert(returning: true)
  end

  @spec create(:invalid | %{optional(:__struct__) => none, optional(atom | binary) => any}) :: any
  def create(data) do
    user = Telescope.Users.get_by_user_id(data.creator_id)

    people_preview_list = [
      %{
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio
      }
    ]

    res = raw_insert(data, people_preview_list)

    res =
      case res do
        {:error, %{errors: [{:creator_id, {"has already been taken"}, _}]}} ->
          raw_insert(data, people_preview_list)

        _ ->
          res
      end

    case res do
      {:ok, conf} ->
        Users.set_current_conf(user.id, conf.id)

      _ ->
        nil
    end

    res
  end

  def edit(conf_id, data) do
    %Conf{id: conf_id}
    |> Conf.edit_changeset(data)
    |> Repo.update()
  end

  def update_name(user_id, name) do
    from(c in Conf,
      where: c.creator_id == ^user_id,
      update: [
        set: [
          name: ^name
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def join_conf(conf, user_id) do
    opts = [
      can_speak: conf.is_private,
      returning: true
    ]

    user = Users.set_current_conf(user_id, conf.id, opts)

    if(
      length(conf.people_preview_list) < 8 or
        not is_nil(Enum.find(conf.people_preview_list, &(&1.id === user_id)))
    ) do
      list =
        [
          %User.Preview{
            id: user.id,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            username: user.username,
            bio: user.bio
          }
          | conf.people_preview_list
        ]
        |> Enum.slice(0, 8)

      increment_conf_people_count(conf.id, list)
    else
      increment_conf_people_count(conf.id)
    end
  end

  def increment_conf_people_count(conf_id) do
    from(c in Conf,
      where: c.id == ^conf_id,
      update: [
        inc: [
          num_people_inside: 1
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def increment_conf_people_count(conf_id, new_people_list) do
    from(c in Conf,
      where: c.id == ^conf_id,
      update: [
        inc: [
          num_people_inside: 1
        ],
        set: [
          people_preview_list: ^new_people_list
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def decrement_conf_people_count(conf_id, new_people_list) do
    from(c in Conf,
      where: c.id == ^conf_id,
      update: [
        inc: [
          num_people_inside: -1
        ],
        set: [
          people_preview_list: ^new_people_list
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def delete_conf_by_id(conf_id) do
    %Conf{id: conf_id} |> Repo.delete()
  end

  def set_conf_privacy_by_creator_id(user_id, is_private, new_name) do
    from(c in Conf,
      where: c.creator_id == ^user_id,
      update: [
        set: [
          is_private: ^is_private,
          name: ^new_name
        ]
      ],
      select: c
    )
    |> Repo.update_all([])
  end

  def set_conf_owner_and_dec(conf_id, user_id, new_people_list) do
    from(c in Conf,
      where: c.id == ^conf_id,
      update: [
        set: [
          creator_id: ^user_id,
          people_preview_list: ^new_people_list
        ],
        inc: [
          num_people_inside: -1
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def leave_conf(user_id, conf_id) do
    conf = Confs.get_conf_by_id(conf_id)

    if not is_nil(conf) do
      if conf.num_people_inside <= 1 do
        delete_conf_by_id(conf.id)
        {:bye, conf}
      else
        Users.set_user_left_current_conf(user_id)

        new_people_list = Enum.filter(conf.people_preview_list, &(&1.id != user_id))

        if conf.creator_id != user_id do
          decrement_conf_people_count(conf.id, new_people_list)
        else
          new_creator = Confs.get_next_creator_for_conf(conf.id)

          if new_creator do
            set_conf_owner_and_dec(conf.id, new_creator.id, new_people_list)
            {:new_creator_id, new_creator.id}
          else
            delete_conf_by_id(conf.id)
            {:bye, conf}
          end
        end
      end
    end
  end

  def replace_conf_owner(user_id, new_creator_id) do
    from(c in Conf,
      where: c.creator_id == ^user_id,
      update: [
        set: [
          creator_id: ^new_creator_id
        ]
      ]
    )
    |> Repo.update_all([])
  end
end
