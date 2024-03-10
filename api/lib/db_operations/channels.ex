defmodule Operations.Channels do
  # ACCESS
  defdelegate get_channel_by_id(id), to: Operations.Access.Channels
  defdelegate get_channels_by_community_id(id), to: Operations.Access.Channels
  defdelegate get_threads_by_channel_id(id), to: Operations.Access.Channels
  defdelegate get_thread_by_id(id), to: Operations.Access.Channels
end
