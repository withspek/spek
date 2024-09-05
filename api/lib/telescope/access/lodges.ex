defmodule Telescope.Access.Lodges do
  @fetch_limit 21

  import Ecto.Query

  alias Telescope.Repo
  alias Telescope.Queries.Lodges, as: Query
  alias Telescope.Schemas.Lodge
  alias Telescope.Schemas.User
  alias Telescope.Schemas.DmMessage

  def get_all_lodges() do
    Query.start()
    |> Repo.all()
  end

  def get_all_lodges_ids() do
    from(l in Lodge, select: l.id)
    |> Repo.all()
  end

  def get_user_lodges(user_id) do
    from(l in Lodge,
      join: elem in fragment("LATERAL unnest(?)", l.recipients),
      on: true,
      where: fragment("?->>'id'", elem) == ^user_id
    )
    |> Repo.all()
  end

  def lodge_lookup(recipients) do
    from(l in Lodge,
      join: elem in fragment("LATERAL unnest(?)", l.recipients),
      on: true,
      where: fragment("?->>'id'", elem) in ^recipients,
      group_by: l.id,
      having: count(elem) == ^length(recipients),
      select: l.id
    )
    |> Repo.one()
  end

  def get_lodge_recipients(recipients_ids) do
    from(u in User,
      where: u.id in ^recipients_ids,
      select: %User.Preview{
        id: u.id,
        avatarUrl: u.avatarUrl,
        bio: u.bio,
        displayName: u.displayName
      }
    )
    |> Repo.all()
  end

  def get_lodge_by_id(id) do
    Query.start()
    |> Query.filter_by_id(id)
    |> Repo.one()
  end

  def get_lodge_messages(lodge_id, offset \\ 20) do
    messages =
      from(m in DmMessage,
        where: m.lodge_id == ^lodge_id,
        limit: ^@fetch_limit,
        offset: ^offset,
        join: u in assoc(m, :user),
        preload: [user: u],
        order_by: [desc: m.inserted_at]
      )
      |> Repo.all()

    {Enum.slice(messages, 0, -1 + @fetch_limit),
     if(length(messages) == @fetch_limit, do: -1 + offset + @fetch_limit, else: nil)}
  end
end
