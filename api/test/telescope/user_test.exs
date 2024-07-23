defmodule Spek.Telescope.UserTest do
  # allow tests to run in parallel
  use ExUnit.Case, async: true
  use SpekTest.Support.EctoSandbox

  alias SpekTest.Support.Factory
  alias Telescope.Schemas.User
  alias Telescope.Repo
  alias Telescope.Users

  describe "you can create a user" do
    @gh_input %{
      "id" => 12234,
      "avatar_url" => "https://foo.bar/baz.jpg",
      "banner_url" => "https://foo.bar/baz.jpg",
      "name" => "test",
      "bio" => "test"
    }

    test "with github" do
      {:create, user} = Users.github_find_or_create(@gh_input, "foo access token")

      [
        ^user
      ] = Repo.all(User)
    end
  end
end
