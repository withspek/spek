defmodule Telescope.Users do
  # MUTATIONS
  defdelegate gitlab_find_or_create(user), to: Telescope.Mutations.Users
  defdelegate github_find_or_create(user, github_access_token), to: Telescope.Mutations.Users
  defdelegate set_offline(user_id), to: Telescope.Mutations.Users
  defdelegate set_online(user_id), to: Telescope.Mutations.Users
  defdelegate update_profile(user_id, data), to: Telescope.Mutations.Users
  defdelegate update(changeset), to: Telescope.Repo
  defdelegate set_current_conf(user_id, conf_id), to: Telescope.Mutations.Users
  defdelegate set_current_conf(user_id, conf_id, opts), to: Telescope.Mutations.Users
  defdelegate set_user_left_current_conf(user_id), to: Telescope.Mutations.Users

  # ACCESS
  defdelegate get_by_user_id(user_id), to: Telescope.Access.Users
  defdelegate get_users, to: Telescope.Access.Users
  defdelegate search_username(username), to: Telescope.Access.Users
  defdelegate get_by_username(username), to: Telescope.Access.Users
  defdelegate get_by_id_with_conf_permissions(user_id), to: Telescope.Access.Users
  defdelegate get_current_conf(user_id), to: Telescope.Access.Users
  defdelegate tuple_get_current_conf_id(user_id), to: Telescope.Access.Users
  defdelegate get_current_conf_id(user_id), to: Telescope.Access.Users
  defdelegate get_users_in_current_conf(user_id), to: Telescope.Access.Users
end
