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

  ####################################################################
  ## ROLE

  @doc """
  sets the role of the user in the conf that they're in. Authorization
  to do so is pulled from the options `:by` keyword.

  """
  def set_role(user_id, role, opts) do
    conf_id = Users.get_current_conf_id(user_id)

    case role do
      _ when is_nil(conf_id) ->
        :noop

      :listener ->
        set_listener(conf_id, user_id, opts[:by])

      :speaker ->
        set_speaker(conf_id, user_id, opts[:by])

      :hand_raised ->
        set_raised_hand(conf_id, user_id, opts[:by])
    end
  end

  ####################################################################
  ## listener

  # you are always allowed to set yourself as listener
  defp set_listener(conf_id, user_id, user_id) do
    internal_set_listener(user_id, conf_id)
  end

  defp set_listener(conf_id, user_id, setter_id) do
    # TODO: refactor this to be simpler.  The list of
    # creators and mods should be in the preloads of the conf.
    with {auth, _} <- Confs.get_conf_status(setter_id),
         {role, _} <- Confs.get_conf_status(user_id) do
      if auth == :creator or (auth == :mod and role not in [:creator, :mod]) do
        internal_set_listener(user_id, conf_id)
      end
    end
  end

  defp internal_set_listener(user_id, conf_id) do
    ConfPermissions.make_listener(user_id, conf_id)
    Pulse.ConfSession.remove_speaker(conf_id, user_id)
  end

  ####################################################################
  ## speaker

  defp set_speaker(nil, _, _), do: :noop

  defp set_speaker(conf_id, user_id, setter_id) do
    if not ConfPermissions.asked_to_speak?(user_id, conf_id) do
      :noop
    else
      case Confs.get_conf_status(setter_id) do
        {_, nil} ->
          :noop

        {:mod, _} ->
          internal_set_speaker(user_id, conf_id)

        {:creator, _} ->
          internal_set_speaker(user_id, conf_id)

        {_, _} ->
          :noop
      end
    end
  end

  # only you can raise your own hand
  defp set_raised_hand(conf_id, user_id, setter_id) do
    if user_id == setter_id do
      if Pulse.ConfSession.get(conf_id, :auto_speaker) do
        internal_set_speaker(user_id, conf_id)
      else
        case ConfPermissions.ask_to_speak(user_id, conf_id) do
          {:ok, %{is_speaker: true}} ->
            internal_set_speaker(user_id, conf_id)

          _ ->
            Pulse.ConfSession.broadcast_ws(
              conf_id,
              %{
                op: "hand_raised",
                d: %{userId: user_id, confId: conf_id}
              }
            )
        end
      end
    end
  end

  @spec internal_set_speaker(any, any) :: nil | :ok | {:err, {:error, :not_found}}
  defp internal_set_speaker(user_id, conf_id) do
    case ConfPermissions.set_speaker(user_id, conf_id, true) do
      {:ok, _} ->
        # kind of horrible to have to make a double genserver call
        # here, we'll have to think about how this works (who owns muting)
        Pulse.ConfSession.add_speaker(
          conf_id,
          user_id,
          Pulse.UserSession.get(user_id, :muted),
          Pulse.UserSession.get(user_id, :deafened)
        )

      err ->
        {:err, err}
    end
  catch
    _, _ ->
      {:error, "conf not found"}
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

  def change_mod(user_id, user_id_to_change, value) do
    if conf = Confs.get_conf_by_creator_id(user_id) do
      ConfPermissions.set_is_mod(user_id_to_change, conf.id, value)

      Pulse.ConfSession.broadcast_ws(conf.id, %{
        op: "mod_changed",
        d: %{confId: conf.id, userId: user_id_to_change}
      })
    end
  end
end
