defmodule Operations.Mutations.Dms do
  import Ecto.Query, warn: false

  def generate_dm_name(user_ids) do
    case length(user_ids) do
      2 ->
        nil
    end
  end

  def create_dm(user_ids) do
  end
end
