defmodule Operations.Users do
  defdelegate create_gitlab_user(data), to: Operations.Mutations.Users
end
