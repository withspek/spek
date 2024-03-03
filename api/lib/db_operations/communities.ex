defmodule Operations.Communities do
  # ACCESS
  defdelegate get_top_communities(limit), to: Operations.Access.Communities

  # MUTATIONS
  defdelegate create_community(data), to: Operations.Mutations.Community
end
