defmodule Operations.Channels do
  # ACCESS
  defdelegate get_channel_by_id(id), to: Operations.Access.Channels
end
