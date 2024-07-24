defmodule Telescope.Access.Lodges do
  import Ecto.Query

  alias Telescope.Repo
  alias Telescope.Queries.Lodges, as: Query
  alias Telescope.Schemas.Lodge
  alias Telescope.Schemas.User

  def get_user_lodges(user_id) do
    from(l in Lodge,
      join: elem in fragment("LATERAL unnest(?)", l.recipients),
      on: true,
      where: fragment("?->>'id'", elem) == ^user_id
    )
    |> Repo.all()
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
end