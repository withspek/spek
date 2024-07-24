defmodule Telescope.Lodges do
  @moduledoc """
  Empty context module for Rooms
  """

  # ACCESS functions
  defdelegate get_user_lodges(user_id), to: Telescope.Access.Lodges
  defdelegate get_lodge_recipients(recipients_ids), to: Telescope.Access.Lodges

  # MUTATIONS functions
  defdelegate create_lodge(recipients, owner_id, type), to: Telescope.Mutations.Lodges
end
