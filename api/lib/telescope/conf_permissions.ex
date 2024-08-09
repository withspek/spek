defmodule Telescope.ConfPermissions do
  import Ecto.Query

  alias Telescope.Schemas.ConfPermission
  alias Telescope.Repo

  def insert(data) do
    %ConfPermission{}
    |> ConfPermission.insert_changeset(data)
    |> Repo.insert(on_conflict: :nothing)
  end

  def upsert(data, set, returning \\ true) do
    %ConfPermission{}
    |> ConfPermission.insert_changeset(data)
    |> Repo.insert(
      on_conflict: [set: set],
      conflict_target: [:user_id, :conf_id],
      returning: returning
    )
  end

  def speaker?(user_id, conf_id) do
    not is_nil(
      Repo.one(
        from(cp in ConfPermission,
          where: cp.conf_id == ^conf_id and cp.user_id == ^user_id and cp.is_speaker == true
        )
      )
    )
  end

  def mod?(user_id, conf_id) do
    not is_nil(
      Repo.one(
        from(cp in ConfPermission,
          where: cp.conf_id == ^conf_id and cp.user_id == ^user_id and cp.is_mod == true
        )
      )
    )
  end

  def asked_to_speak?(user_id, conf_id) do
    not is_nil(
      Repo.one(
        from(cp in ConfPermission,
          where: cp.conf_id == ^conf_id and cp.user_id == ^user_id and cp.asked_to_speak == true
        )
      )
    )
  end

  def get_conf_perms(user_id, conf_id) do
    from(cp in ConfPermission, where: cp.user_id == ^user_id and cp.conf_id == ^conf_id, limit: 1)
    |> Repo.one()
  end

  def ask_to_speak(user_id, conf_id) do
    upsert(%{conf_id: conf_id, user_id: user_id, asked_to_speak: true}, asked_to_speak: true)
  end

  def set_speaker(user_id, conf_id, speaker?, returning \\ false) do
    upsert(
      %{conf_id: conf_id, userId: user_id, is_speaker: speaker?},
      [is_speaker: speaker?],
      returning
    )
  end

  def set_is_mod(user_id, conf_id, is_mod) do
    upsert(
      %{conf_id: conf_id, user_id: user_id, is_mod: is_mod},
      [is_mod: is_mod],
      false
    )
  end

  def make_listener(user_id, conf_id) do
    upsert(
      %{conf_id: conf_id, user_id: user_id, is_speaker: false, asked_to_speak: false},
      [is_speaker: false, asked_to_speak: false],
      false
    )
  end
end
