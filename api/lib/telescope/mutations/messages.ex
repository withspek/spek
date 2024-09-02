defmodule Telescope.Mutations.Messages do
  import Ecto.Query

  alias Telescope.Schemas.Message
  alias Telescope.Schemas.Thread
  alias Telescope.Repo
  alias Telescope.Users
  alias Telescope.Messages

  def create_thread_message(data) do
    Message.changeset(%Message{
      text: data["text"],
      threadId: data["threadId"],
      userId: data["userId"]
    })
    |> Repo.insert!(returning: true)
    |> Repo.preload(:user)
  end

  def delete_thread_message_by_id(message_id) do
    %Message{id: message_id} |> Repo.delete()
  end

  def update_message(user_id, message_id, new_text) do
    from(m in Message,
      where: m.userId == ^user_id and m.id == ^message_id,
      update: [
        set: [
          text: ^new_text
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def create_thread_from_message(message_id, user_id, channel_id, community_id) do
    message = Messages.get_message_by_id(message_id)
    user = Users.get_by_user_id(user_id)

    people_inside = [
      %{
        id: user.id,
        avatarUrl: user.id,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio
      }
    ]

    %Thread{
      name: message.text,
      creatorId: user.id,
      channelId: channel_id,
      communityId: community_id,
      peoplePreviewList: people_inside
    }
    |> Thread.changeset()
    |> Repo.insert!(returning: true)
  end
end
