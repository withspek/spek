defmodule Telescope.Dms do
  # ACCESS
  defdelegate dm_exists?(user_id_1, user_id_2), to: Telescope.Access.Dms
  defdelegate get_dm_by_user_ids(user_id_1, user_id_2), to: Telescope.Access.Dms
  defdelegate get_user_dms(user_id), to: Telescope.Access.Dms
  defdelegate all_dms_ids(), to: Telescope.Access.Dms
  defdelegate get_dm_by_id(dm_id), to: Telescope.Access.Dms
  defdelegate get_dm_messages(dm_id, offset), to: Telescope.Access.Dms

  # MUTATIONS
  defdelegate create_dm(user_ids), to: Telescope.Mutations.Dms
  defdelegate create_dm_message(dm_id, user_id, text), to: Telescope.Mutations.Dms
end
