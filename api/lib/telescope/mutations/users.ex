defmodule Telescope.Mutations.Users do
  import Ecto.Query, warn: false

  alias Telescope.Repo
  alias Telescope.Schemas.User
  alias Telescope.Queries.Users, as: Query

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
end
