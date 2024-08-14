defmodule Telescope.Confs do
  @moduledoc """
  Empty context module for Confs
  """

  # ACCESS functions
  defdelegate get_next_creator_for_conf(conf_id), to: Telescope.Access.Confs
  defdelegate get_top_public_confs(community_id, user_id, offset), to: Telescope.Access.Confs
  defdelegate get_conf_by_id(conf_id), to: Telescope.Access.Confs
  defdelegate can_join_conf(conf_id, user_id), to: Telescope.Access.Confs
  defdelegate get_conf_by_creator_id(creator_id), to: Telescope.Access.Confs
  defdelegate get_a_user_for_conf(conf_id), to: Telescope.Access.Confs
  defdelegate owner?(conf_id, user_id), to: Telescope.Access.Confs
  defdelegate search_name(start_of_name), to: Telescope.Access.Confs
  defdelegate get_conf_status(user_id), to: Telescope.Access.Confs

  # MUTATIONS functions
  defdelegate create(data), to: Telescope.Mutations.Confs
  defdelegate edit(conf_id, data), to: Telescope.Mutations.Confs
  defdelegate update_name(user_id, name), to: Telescope.Mutations.Confs
  defdelegate join_conf(conf, user_id), to: Telescope.Mutations.Confs
  defdelegate delete_conf_by_id(conf_id), to: Telescope.Mutations.Confs

  defdelegate set_conf_privacy_by_creator_id(user_id, is_private, new_name),
    to: Telescope.Mutations.Confs

  defdelegate leave_conf(user_id, conf_id), to: Telescope.Mutations.Confs
  defdelegate replace_conf_owner(user_id, new_creator_id), to: Telescope.Mutations.Confs
end
