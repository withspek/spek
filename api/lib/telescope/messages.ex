defmodule Telescope.Messages do
  # ACCESS
  defdelegate get_thread_messages(threadId, offset), to: Telescope.Access.Messages
  defdelegate get_message_by_id(message_id), to: Telescope.Access.Messages

  # MUTATIONS
  defdelegate create_thread_message(data), to: Telescope.Mutations.Messages
  defdelegate delete_thread_message_by_id(message_id), to: Telescope.Mutations.Messages
  defdelegate update_message(data, message_id), to: Telescope.Mutations.Messages

  defdelegate create_thread_from_message(message_id, user_id, channel_id, community_id),
    to: Telescope.Mutations.Messages
end
