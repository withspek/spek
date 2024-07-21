defmodule Telescope.Communities do
  # ACCESS
  defdelegate get_top_communities(limit), to: Telescope.Access.Communities
  defdelegate all_communities(), to: Telescope.Access.Communities
  defdelegate get_community_by_slug(slug, user_id), to: Telescope.Access.Communities
  defdelegate get_community_by_id(id, user_id), to: Telescope.Access.Communities
  defdelegate get_community_members(communityId), to: Telescope.Access.Communities
  defdelegate get_community_permissions(communityId, userId), to: Telescope.Access.Communities
  defdelegate search_name(start_of_name), to: Telescope.Access.Communities
  defdelegate get_top_threads_with_message_counts, to: Telescope.Access.Communities

  defdelegate is_member?(communityId, userId), to: Telescope.Access.Communities
  defdelegate get_community_id_by_thread_id(thread_id), to: Telescope.Access.Communities
  defdelegate all_threads_ids(), to: Telescope.Access.Communities

  # MUTATIONS
  defdelegate create_community(data), to: Telescope.Mutations.Community
  defdelegate join_community(communityId, userId), to: Telescope.Mutations.Community
  defdelegate leave_community(community_id, user_id), to: Telescope.Mutations.Community
  defdelegate delete_community(community_id, user_id), to: Telescope.Mutations.Community
  defdelegate update_community(community_id, data, user_id), to: Telescope.Mutations.Community
end
