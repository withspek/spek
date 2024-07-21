defmodule Telescope.Messages do
  # ACCESS
  defdelegate get_thread_messages(threadId, offset), to: Telescope.Access.Messages

  # MUTATIONS
  defdelegate create_thread_message(data), to: Telescope.Mutations.Messages
end
