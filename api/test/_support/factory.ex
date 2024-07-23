defmodule SpekTest.Support.Factory do
  @moduledoc """
  defines the `create/2` function

  Parameter 1: The module for the schema representing the database table
  You are trying to populate

  Parameter 2: any fields we would like to override
  """

  alias Telescope.Repo
  alias Telescope.Schemas.User

  def create(struct, data \\ [])

  def create(User, data) do
    merged_data =
      Keyword.merge(
        [
          githubId: Faker.Internet.user_name(),
          twitterId: Faker.Internet.user_name(),
          displayName: Faker.Internet.user_name(),
          username: String.slice(String.replace(Faker.Internet.user_name(), ".", "_"), 0..14),
          email: Faker.Internet.free_email(),
          avatarUrl: "https://example.com/abc.jpg",
          bannerUrl: "https://example.com/abc.jpg",
          bio: "a dogehouse user",
          tokenVersion: 1
        ],
        data
      )

    User
    |> struct(merged_data)
    |> Repo.insert!(returning: true)
  end
end
