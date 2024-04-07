defmodule Operations.Channels do
  # ACCESS
  defdelegate get_channel_by_id(id), to: Operations.Access.Channels
  defdelegate get_channels_by_community_id(id), to: Operations.Access.Channels
  defdelegate get_threads_by_channel_id(id), to: Operations.Access.Channels
  defdelegate get_thread_by_id(id, user_id), to: Operations.Access.Channels
  defdelegate get_channel_members(channelId), to: Operations.Access.Channels
  defdelegate search_thread_name(start_of_name), to: Operations.Access.Channels

  # MUTATIONS
  defdelegate create_thread(data), to: Operations.Mutations.Channels
end
