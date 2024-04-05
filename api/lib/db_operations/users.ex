defmodule Operations.Users do
  # MUTATIONS
  defdelegate gitlab_find_or_create(user), to: Operations.Mutations.Users
  defdelegate github_find_or_create(user, github_access_token), to: Operations.Mutations.Users
  defdelegate set_offline(user_id), to: Operations.Mutations.Users
  defdelegate set_online(user_id), to: Operations.Mutations.Users
  defdelegate update_profile(user_id, data), to: Operations.Mutations.Users
  defdelegate update(changeset), to: Spek.Repo
  defdelegate search_username(username), to: Operations.Access.Users

  # ACCESS
  defdelegate get_user_id(user_id), to: Operations.Access.Users
  defdelegate get_users, to: Operations.Access.Users
  defdelegate get_by_username(username), to: Operations.Access.Users
end
