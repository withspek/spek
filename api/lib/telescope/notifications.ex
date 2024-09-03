defmodule Telescope.Notifications do
  @moduledoc """
  Empty context module for Lodges
  """

  # MUTATIONS
  defdelegate create_notification(data), to: Telescope.Mutations.Nofitications
  defdelegate mark_as_read(id), to: Telescope.Mutations.Nofitications
  defdelegate mark_as_unread(id), to: Telescope.Mutations.Nofitications

  # ACCESS
end
