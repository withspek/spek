defmodule Operations.Dms do
  # ACCESS
  defdelegate get_dm_by_user_ids(user_id_1, user_id_2), to: Operations.Access.Dms
  defdelegate get_user_dms(user_id), to: Operations.Access.Dms
  defdelegate all_dms_ids(), to: Operations.Access.Dms
  defdelegate get_dm_by_id(dm_id), to: Operations.Access.Dms
  defdelegate get_dm_messages(dm_id), to: Operations.Access.Dms

  # MUTATIONS
  defdelegate create_dm(user_ids), to: Operations.Mutations.Dms
  defdelegate create_dm_message(dm_id, user_id, text), to: Operations.Mutations.Dms
end
