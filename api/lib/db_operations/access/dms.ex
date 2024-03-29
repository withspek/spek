defmodule Operations.Access.Dms do
  import Ecto.Query, warn: false

  alias Models.User
  alias Models.Dm
  alias Spek.Repo

  def get_user_dms(user_id) do
    query =
      from(dm in Dm,
        inner_join: u in User,
        on: u.id != ^user_id and (u.id == dm.userId1 or u.id == dm.userId2),
        where: dm.userId1 == ^user_id or dm.userId2 == ^user_id,
        select: %Dm.Reply{
          read:
            fragment("""
            case
            when u1.id = d0."userId1" then d0.read2
            else d0.read1
            end "read"
            """),
          id: dm.id,
          displayName: u.displayName,
          avatarUrl: u.avatarUrl,
          online: u.online,
          inserted_at: fragment("date_part('epoch', ?) * 1000", dm.inserted_at),
          message:
            fragment(
              """
              SELECT json_build_object('text', CASE WHEN char_length(text) > 40 THEN substr(text, 0, 40) || '...' ELSE text END, 'inserted_at', date_part('epoch', m.inserted_at) * 1000) FROM dm_messages m WHERE (m."recipientId" = ? AND m."senderId" = d0."userId2") OR (m."senderId" = ? AND m."recipientId" = d0."userId2") ORDER BY m.inserted_at DESC LIMIT 1
              """,
              ^user_id,
              ^user_id
            )
        },
        limit: 150
      )

    Repo.all(query)
  end

  def get_dm_by_user_ids(user_id_1, user_id_2) do
    query =
      from(d in Dm,
        where:
          (d.userId1 == ^user_id_1 and d.userId2 == ^user_id_2) or
            (d.userId1 == ^user_id_2 and d.userId2 == ^user_id_2)
      )

    Repo.one(query)
  end
end
