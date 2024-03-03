defmodule Operations.Mutations.Community do
  alias Models.Community
  alias Spek.Repo

  def create_community(data) do
    %Community{
      description: data["description"],
      name: data["name"],
      isPrivate: false,
      ownerId: data["ownerId"]
    }
    |> Community.changeset(data)
    |> Repo.insert!(returning: true)
  end
end
