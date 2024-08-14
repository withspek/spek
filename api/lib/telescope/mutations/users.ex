defmodule Telescope.Mutations.Users do
  import Ecto.Query, warn: false

  alias Telescope.Repo
  alias Telescope.Schemas.User
  alias Telescope.Queries.Users, as: Query
  alias Telescope.ConfPermissions

  def update_profile(user_id, data) do
    user_id
    |> Telescope.Users.get_by_user_id()
    |> User.edit_changeset(data)
    |> Repo.update()
  end

  def set_online(user_id) do
    Query.start()
    |> Query.filter_by_id(user_id)
    |> Query.update_set_online_true()
    |> Repo.update_all([])
  end

  def set_offline(user_id) do
    Query.start()
    |> Query.filter_by_id(user_id)
    |> Query.update_set_online_false()
    |> Query.update_set_last_online_to_now()
    |> Repo.update_all([])
  end

  def gitlab_find_or_create(user) do
    gitlabId = Integer.to_string(user["id"])

    db_user = from(u in User, where: u.gitlabId == ^gitlabId, limit: 1) |> Repo.one()

    if db_user do
      if is_nil(db_user.gitlabId) do
        from(u in User,
          where: u.gitlabId == ^gitlabId,
          update: [
            set: [
              gitlabId: ^gitlabId
            ]
          ]
        )
        |> Repo.update_all([])
      end

      {:find, db_user}
    else
      {:create,
       Repo.insert!(
         %User{
           avatarUrl: user["avatar_url"],
           bio: user["bio"],
           displayName: user["name"],
           email: user["email"],
           gitlabId: gitlabId,
           username: user["username"]
         },
         returning: true
       )}
    end
  end

  def github_find_or_create(user, _github_access_token) do
    githubId = Integer.to_string(user["id"])

    db_user =
      from(u in User,
        where: u.githubId == ^githubId,
        limit: 1
      )
      |> Repo.one()

    if db_user do
      if is_nil(db_user.githubId) do
        from(u in User,
          where: u.id == ^db_user.id,
          update: [
            set: [
              githubId: ^githubId
            ]
          ]
        )
        |> Repo.update_all([])
      end

      {:find, db_user}
    else
      {:create,
       Repo.insert!(
         %User{
           username: Spek.Utils.Random.big_ascii_id(),
           githubId: githubId,
           email: if(user["email"] == "", do: nil, else: user["email"]),
           avatarUrl: user["avatar_url"],
           bannerUrl: user["banner_url"],
           displayName:
             if(is_nil(user["name"]) or String.trim(user["name"]) == "",
               do: "Novice",
               else: user["name"]
             ),
           bio: user["bio"]
         },
         returning: true
       )}
    end
  end

  def set_current_conf(user_id, conf_id, opts \\ []) do
    conf_permissions =
      case opts[:can_speak] do
        true ->
          case ConfPermissions.set_speaker(user_id, conf_id, true, true) do
            {:ok, x} -> x
            _ -> nil
          end

        _ ->
          ConfPermissions.get_conf_perms(user_id, conf_id)
      end

    Pulse.UserSession.set_current_conf_id(user_id, conf_id)

    q =
      from(u in User,
        where: u.id == ^user_id,
        update: [
          set: [
            current_conf_id: ^conf_id
          ]
        ]
      )

    q = if opts[:returning], do: select(q, [u], u), else: q

    case Repo.update_all(q, []) do
      {_, [user]} -> %{user | conf_permissions: conf_permissions}
      _ -> nil
    end
  end

  def set_user_left_current_conf(user_id) do
    Pulse.UserSession.set_current_conf_id(user_id, nil)

    Query.start()
    |> Query.filter_by_id(user_id)
    |> Query.update_set_current_conf_nil()
    |> Repo.update_all([])
  end
end
