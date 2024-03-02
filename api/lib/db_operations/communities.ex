defmodule Operations.Communities do
  # MUTATIONS
  defdelegate create_community(data), to: Operations.Mutations.Community
end
