defmodule Operations.Mutations.Messages do
  alias Models.Message
  alias Spek.Repo

  def create_thread_message(data) do
    Message.changeset(%Message{
      text: data["text"],
      threadId: data["threadId"],
      userId: data["userId"]
    })
    |> Repo.insert!(returning: true)
  end
end
