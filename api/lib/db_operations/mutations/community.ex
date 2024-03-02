defmodule Operations.Mutations.Community do
  alias Models.Community
  alias Spek.Repo

  def create_community(data) do
    {:ok,
     Repo.insert!(
       %Community{
         description: data["description"],
         name: data["name"],
         isPrivate: false,
         owner_id: data["ownerId"],
         website: data["website"]
       },
       returning: true
     )}
  end
end
