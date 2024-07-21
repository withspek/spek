defmodule Telescope.Mutations.Messages do
  alias Telescope.Schemas.Message
  alias Telescope.Repo

  def create_thread_message(data) do
    Message.changeset(%Message{
      text: data["text"],
      threadId: data["threadId"],
      userId: data["userId"]
    })
    |> Repo.insert!(returning: true)
    |> Repo.preload(:user)
  end
end
