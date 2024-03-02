defmodule Operations.Users do
  # MUTATIONS
  defdelegate gitlab_find_or_create(user), to: Operations.Mutations.Users

  # ACCESS

  defdelegate get_users, to: Operations.Access.Users
end
