defmodule Operations.Messages do
  # ACCESS
  defdelegate get_thread_messages(threadId), to: Operations.Access.Messages

  # MUTATIONS
end
