defmodule Telescope.Mutations.Lodges do
  import Ecto.Query, warn: false

  alias Pulse.LodgeSession
  alias Telescope.Repo
  alias Telescope.Users
  alias Telescope.Schemas.Lodge
  alias Telescope.Schemas.User
  alias Telescope.Schemas.DmMessage
  alias Telescope.Queries.Lodges, as: Query

  def create_lodge(recipients, owner_id, type \\ 1) do
    member_count = if type == 1, do: 2, else: length(recipients)

    lodge =
      %Lodge{
        type: type,
        recipients: recipients,
        owner_id: owner_id,
        member_count: member_count,
        nsfw: false
      }
      |> Lodge.changeset()
      |> Repo.insert!(returning: true)

    LodgeSession.start_supervised(lodge_id: lodge.id)

    lodge
  end

  def delete_lodge(lodge_id, user_id) do
    Query.start()
    |> Query.filter_by_owner_id(lodge_id, user_id)
    |> Repo.delete_all()
  end

  def add_recipient(lodge, user_id) do
    user = Users.get_by_user_id(user_id)

    if length(lodge.recipients) < lodge.user_limit and
         is_nil(Enum.find(lodge.recipients, &(&1.id == user_id))) do
      list =
        [
          %User.Preview{
            id: user.id,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            displayName: user.displayName
          }
          | lodge.recipients
        ]
        |> Enum.slice(0, lodge.user_limit)

      type = if length(list) > 2, do: 2, else: 1

      increment_lodge_member_count(lodge.id, list, type)
    end
  end

  def increment_lodge_member_count(lodge_id, new_recipients_list, type \\ 1) do
    from(l in Lodge,
      where: l.id == ^lodge_id,
      update: [
        inc: [
          member_count: 1
        ],
        set: [
          recipients: ^new_recipients_list,
          type: ^type
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def remove_recipient(lodge, user_id) do
    user = Users.get_by_user_id(user_id)

    if user and lodge.owner_id == user_id and
         Enum.find(lodge.recipients, &(&1.id == user_id)) and length(lodge.recipients) > 2 do
      list = Enum.filter(lodge.recipients, &(&1.id != user_id))
      type = if length(list) > 2, do: 2, else: 1
      decrement_lodge_member_count(lodge.id, list, type)
    end
  end

  def leave_lodge(lodge, user_id) do
    user = Users.get_by_user_id(user_id)

    if user and Enum.find(lodge.recipients, &(&1.id == user_id)) do
      list = Enum.filter(lodge.recipients, &(&1.id != user_id))
      type = if length(list) > 2, do: 2, else: 1
      decrement_lodge_member_count(lodge.id, list, type)
    end
  end

  def decrement_lodge_member_count(lodge_id, new_recipients_list, type \\ 1) do
    from(l in Lodge,
      where: l.id == ^lodge_id,
      update: [
        inc: [
          member_count: -1
        ],
        set: [
          recipients: ^new_recipients_list,
          type: ^type
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def create_lodge_message(lodge_id, user_id, text) do
    DmMessage.changeset(%DmMessage{user_id: user_id, text: text, lodge_id: lodge_id})
    |> Repo.insert!()
    |> Repo.preload(:user)
  end
end
