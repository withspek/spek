defmodule Telescope.Queries.Users do
  @moduledoc """
  all functions in this module should be "Query builder" functions,
  they should not touch the database.
  """

  import Ecto.Query, warn: false

  alias Telescope.Schemas.Notification
  alias Telescope.Schemas.User

  def start do
    from(u in User)
  end

  def select_id(query) do
    select(query, [u], u.id)
  end

  def filter_by_id(query, user_id) do
    where(query, [u], u.id == ^user_id)
  end

  def filter_by_username(query, username) do
    where(query, [u], u.username == ^username)
  end

  def limit_one(query) do
    limit(query, [], 1)
  end

  def update_set_online_true(query) do
    update(query,
      set: [
        online: true
      ]
    )
  end

  def update_set_online_false(query) do
    update(query,
      set: [
        online: false
      ]
    )
  end

  def update_set_last_online_to_now(query) do
    update(query,
      set: [
        lastOnline: fragment("now()")
      ]
    )
  end

  def filter_by_github_ids(query, github_ids) do
    where(query, [u], u.githubId in ^github_ids)
  end

  def filter_by_gitlab_ids(query, gitlab_ids) do
    where(query, [u], u.gitlabId in ^gitlab_ids)
  end

  def update_set_current_conf_nil(query) do
    update(query,
      set: [
        current_conf_id: nil
      ]
    )
  end

  def notification_info(query) do
    query
    |> join(:left, [u], n in Notification,
      as: :notifications,
      on: n.user_id == u.id and n.read == false
    )
    |> group_by([n], n.id)
    |> select_merge([notifications: n], %{
      unread_notifications: count(n)
    })
  end
end
