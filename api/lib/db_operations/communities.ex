defmodule Operations.Communities do
  # ACCESS
  defdelegate get_top_communities(limit), to: Operations.Access.Communities
  defdelegate get_community_by_id(id), to: Operations.Access.Communities

  # MUTATIONS
  defdelegate create_community(data), to: Operations.Mutations.Community
end
