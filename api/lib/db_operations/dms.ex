defmodule Operations.Dms do
  # ACCESS
  defdelegate get_dm_by_user_ids(user_id_1, user_id_2), to: Operations.Access.Dms
  defdelegate get_user_dms(user_id), to: Operations.Access.Dms

  # MUTATIONS
  defdelegate create_dm(user_ids), to: Operations.Mutations.Dms
end
