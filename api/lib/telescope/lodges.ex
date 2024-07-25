defmodule Telescope.Lodges do
  @moduledoc """
  Empty context module for Rooms
  """

  # ACCESS functions
  defdelegate get_all_lodges(), to: Telescope.Access.Lodges
  defdelegate get_all_lodges_ids(), to: Telescope.Access.Lodges
  defdelegate get_user_lodges(user_id), to: Telescope.Access.Lodges
  defdelegate get_lodge_by_id(lodge_id), to: Telescope.Access.Lodges
  defdelegate get_lodge_recipients(recipients_ids), to: Telescope.Access.Lodges
  defdelegate get_lodge_messages(lodge_id, cursor), to: Telescope.Access.Lodges

  # MUTATIONS functions
  defdelegate create_lodge(recipients, owner_id, type), to: Telescope.Mutations.Lodges
  defdelegate delete_lodge(lodge_id, owner_id), to: Telescope.Mutations.Lodges
  defdelegate add_recipient(lodge, user_id), to: Telescope.Mutations.Lodges
  defdelegate remove_recipient(lodge, user_id), to: Telescope.Mutations.Lodges
  defdelegate create_lodge_message(lodge_id, user_id, text), to: Telescope.Mutations.Lodges
end
