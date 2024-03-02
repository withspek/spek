defmodule Operations.Mutations.Users do
  alias Spek.Repo
  alias Models.User
  alias Ecto.Query
  import Query

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
end
