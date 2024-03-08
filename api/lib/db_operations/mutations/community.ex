defmodule Operations.Mutations.Community do
  alias Models.Channel
  alias Ecto.Multi
  alias Models.Community
  alias Spek.Repo

  def create_community(data) do
    multi_struct =
      Multi.new()
      |> Multi.insert(
        :community,
        Community.changeset(%Community{
          id: Ecto.UUID.autogenerate(),
          name: data["name"],
          isPrivate: false,
          ownerId: data["ownerId"],
          description: data["description"]
        })
      )
      |> Multi.insert(:channel, fn %{community: community} ->
        Channel.changeset(%Channel{
          id: Ecto.UUID.autogenerate(),
          description: "This is where all threads start",
          name: "general",
          isPrivate: false,
          isDefault: true
        })
        |> Ecto.Changeset.put_assoc(:community, community)
      end)

    case Repo.transaction(multi_struct) do
      {:ok, %{community: community, channel: channel}} ->
        {:ok, community, channel}

      {:error, :channel, channel_changeset} ->
        IO.puts(channel_changeset)
    end
  end
end
