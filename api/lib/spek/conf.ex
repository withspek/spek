defmodule Spek.Conf do
  alias Spek.Utils.VoiceServerUtils
  alias Pulse.ConfSession
  alias Telescope.Confs
  alias Telescope.Users
  alias Telescope.ConfPermissions

  def set_auto_speaker(user_id, value) do
    if conf = Confs.get_conf_by_creator_id(user_id) do
      ConfSession.set_auto_speaker(conf.id, value)
    end
  end

  defp internal_set_listener(user_id_to_make_listener, conf_id) do
    ConfPermissions.make_listener(user_id_to_make_listener, conf_id)
    ConfSession.remove_speaker(conf_id, user_id_to_make_listener)
  end

  def set_listener(user_id, user_id_to_set_listener) do
    if user_id == user_id_to_set_listener do
      internal_set_listener(
        user_id_to_set_listener,
        Users.get_current_conf_id(user_id_to_set_listener)
      )
    else
      {status, conf} = Confs.get_conf_status(user_id_to_set_listener)

      is_creator = user_id_to_set_listener == not is_nil(conf)

      if not is_creator and (status == :creator or status == :mod) do
        internal_set_listener(
          user_id_to_set_listener,
          Users.get_current_conf_id(user_id_to_set_listener)
        )
      end
    end
  end

  def internal_set_speaker(user_id_to_make_speaker, conf_id, true) do
    case ConfPermissions.set_speaker(user_id_to_make_speaker, conf_id, true) do
      {:ok, _} ->
        ConfSession.add_speaker(
          conf_id,
          user_id_to_make_speaker,
          Pulse.UserSession.get(user_id_to_make_speaker, :muted),
          Pulse.UserSession.get(user_id_to_make_speaker, :deafened)
        )

      error ->
        {:err, error}
    end
  catch
    _, _ ->
      {:error, "conf not found"}
  end

  @spec make_speaker(any(), any()) :: none() | no_return()
  def make_speaker(user_id, user_id_to_make_speaker) do
    with {status, conf} when status in [:creator, :mod] <- Confs.get_conf_status(user_id),
         true <- ConfPermissions.asked_to_speak?(user_id_to_make_speaker, conf.id) do
      internal_set_speaker(user_id_to_make_speaker, conf.id, true)
    end
  end

  def join_voice_conf(user_id, conf, speaker? \\ nil) do
    speaker? =
      if is_nil(speaker?),
        do: conf.creator_id == user_id or ConfPermissions.speaker?(user_id, conf.id),
        else: speaker?

    op =
      if speaker?,
        do: "join-as-speaker",
        else: "join-as-new-peer"

    Pulse.Voice.send(conf.voice_server_id, %{
      op: op,
      d: %{confId: conf.id, peerId: user_id},
      uid: user_id
    })
  end

  @spec create_conf(
          String.t(),
          String.t(),
          String.t(),
          boolean() | nil
        ) ::
          {:error, any()}
          | {:ok,
             %{
               conf: atom() | %{:id => any(), :voice_server_id => any(), optional(any()) => any()}
             }}
  def create_conf(
        user_id,
        conf_name,
        conf_description,
        community_id,
        is_private \\ nil
      ) do
    conf_id = Users.get_current_conf_id(user_id)

    if not is_nil(conf_id) do
      leave_conf(user_id, conf_id)
    end

    id = Ecto.UUID.generate()

    case Confs.create(%{
           id: id,
           name: conf_name,
           description: conf_description,
           creator_id: user_id,
           community_id: community_id,
           num_people_inside: 1,
           voice_server_id: VoiceServerUtils.get_next_voice_server_id(),
           is_private: is_private
         }) do
      {:ok, conf} ->
        ConfSession.start_supervised(
          conf_id: conf.id,
          voice_server_id: conf.voice_server_id
        )

        muted? = Pulse.UserSession.get(user_id, :muted)
        deafened? = Pulse.UserSession.get(user_id, :deafened)

        ConfSession.join_conf(conf.id, user_id, muted?, deafened?, no_fan: true)

        Pulse.Voice.send(conf.voice_server_id, %{
          op: "create-conf",
          d: %{confId: conf.id},
          uid: user_id
        })

        join_voice_conf(user_id, conf, true)

        {:ok, %{conf: conf}}

      {:error, changeset_error} ->
        {:error,
         Spek.Utils.Errors.changeset_to_first_err_message_with_field_name(changeset_error)}
    end
  end

  def leave_conf(user_id, current_conf_id \\ nil) do
    current_conf_id =
      if is_nil(current_conf_id),
        do: Users.get_current_conf_id(user_id),
        else: current_conf_id

    if current_conf_id do
      case Confs.leave_conf(user_id, current_conf_id) do
        # the conference should be destroyed
        {:bye, conf} ->
          ConfSession.destroy(current_conf_id, user_id)

          Pulse.Voice.send(conf.voice_server_id, %{
            op: "destroy-conf",
            uid: user_id,
            d: %{peerId: user_id, confId: current_conf_id}
          })

        x ->
          case x do
            {:new_creator_id, creator_id} ->
              ConfSession.broadcast_ws(current_conf_id, %{
                op: "new_conf_creator",
                d: %{confId: current_conf_id, userId: creator_id}
              })

            _ ->
              nil
          end

          ConfSession.leave_conf(current_conf_id, user_id)
      end

      {:ok, %{conf_id: current_conf_id}}
    else
      {:error, "you are not in a conference"}
    end
  end

  def join_conf(user_id, conf_id) do
    current_conf_id = Telescope.Users.get_current_conf_id(user_id)

    if current_conf_id == conf_id do
      %{conf: Confs.get_conf_by_id(conf_id)}
    else
      case Confs.can_join_conf(conf_id, user_id) do
        {:error, message} ->
          %{error: message}

        {:ok, conf} ->
          if current_conf_id do
            leave_conf(user_id, current_conf_id)
          end

          updated_user = Confs.join_conf(conf, user_id)

          muted? = Pulse.UserSession.get(user_id, :muted)
          deafened? = Pulse.UserSession.get(user_id, :deafened)

          ConfSession.join_conf(conf_id, user_id, muted?, deafened?)

          can_speak =
            case updated_user do
              %{conf_permissions: %{is_speaker: true}} -> true
              _ -> false
            end

          join_voice_conf(user_id, conf, can_speak || conf.is_private)
          %{conf: conf}
      end
    end
  catch
    _, _ -> {:error, "that conf does not exist"}
  end
end
