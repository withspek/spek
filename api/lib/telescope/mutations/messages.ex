defmodule Telescope.Mutations.Messages do
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

  def update_message(data, message_id) do
    message_id
    |> Messages.get_message_by_id()
    |> Message.edit_changeset(data)
    |> Repo.update()
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
