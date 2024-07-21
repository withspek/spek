defmodule Telescope.Channels do
  # ACCESS
  defdelegate get_channel_by_id(id, me_id), to: Telescope.Access.Channels
  defdelegate get_channels_by_community_id(id, me_id), to: Telescope.Access.Channels
  defdelegate get_threads_by_channel_id(id), to: Telescope.Access.Channels
  defdelegate get_thread_by_id(id, user_id), to: Telescope.Access.Channels
  defdelegate get_channel_members(channelId), to: Telescope.Access.Channels
  defdelegate search_thread_name(start_of_name), to: Telescope.Access.Channels
  defdelegate get_top_active_threads(), to: Telescope.Access.Channels

  # MUTATIONS
  defdelegate create_thread(data), to: Telescope.Mutations.Channels
  defdelegate delete_channel(channel_id, user_id), to: Telescope.Mutations.Channels
  defdelegate create_channel(data, user_id), to: Telescope.Mutations.Channels
  defdelegate join_channel(channel_id, user_id), to: Telescope.Mutations.Channels
  defdelegate leave_channel(channel_id, user_id), to: Telescope.Mutations.Channels
  defdelegate update_channel(channel_id, data, user_id), to: Telescope.Mutations.Channels
end
