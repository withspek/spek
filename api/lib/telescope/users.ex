defmodule Telescope.Users do
  # MUTATIONS
  defdelegate gitlab_find_or_create(user), to: Telescope.Mutations.Users
  defdelegate github_find_or_create(user, github_access_token), to: Telescope.Mutations.Users
  defdelegate set_offline(user_id), to: Telescope.Mutations.Users
  defdelegate set_online(user_id), to: Telescope.Mutations.Users
  defdelegate update_profile(user_id, data), to: Telescope.Mutations.Users
  defdelegate update(changeset), to: Telescope.Repo
  defdelegate search_username(username), to: Telescope.Access.Users

  # ACCESS
  defdelegate get_user_id(user_id), to: Telescope.Access.Users
  defdelegate get_users, to: Telescope.Access.Users
  defdelegate get_by_username(username), to: Telescope.Access.Users
end
