```elixir
# In thread.ex, add a new schema for ThreadReadStatus
defmodule Telescope.Schemas.ThreadReadStatus do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  schema "thread_read_statuses" do
    belongs_to(:thread, Telescope.Schemas.Thread, type: :binary_id)
    belongs_to(:user, Telescope.Schemas.User, type: :binary_id)
    field(:last_read_message_id, :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(thread_read_status, attrs) do
    thread_read_status
    |> cast(attrs, [:thread_id, :user_id, :last_read_message_id])
    |> validate_required([:thread_id, :user_id, :last_read_message_id])
    |> unique_constraint([:thread_id, :user_id])
  end
end


# In thread_session.ex, update the State struct
defmodule Pulse.ThreadSession do
  # ... existing code ...

  defmodule State do
    defstruct thread_id: "",
              active: true,
              lastMessage: nil,
              users: [],
              read_statuses: %{}  # New field to track read statuses
  end

  # ... existing code ...

  # Add new functions for handling read/unread messages
  def mark_as_read(thread_id, user_id, message_id) do
    cast(thread_id, {:mark_as_read, user_id, message_id})
  end

  defp mark_as_read_impl(user_id, message_id, state) do
    new_read_statuses = Map.put(state.read_statuses, user_id, message_id)

    # Persist the read status to the database
    Telescope.Schemas.ThreadReadStatus.changeset(%Telescope.Schemas.ThreadReadStatus{}, %{
      thread_id: state.thread_id,
      user_id: user_id,
      last_read_message_id: message_id
    })
    |> Telescope.Repo.insert(on_conflict: :replace_all, conflict_target: [:thread_id, :user_id])

    {:noreply, %{state | read_statuses: new_read_statuses}}
  end

  def get_unread_messages(thread_id, user_id) do
    call(thread_id, {:get_unread_messages, user_id})
  end

  defp get_unread_messages_impl(user_id, _reply, state) do
    last_read_message_id = Map.get(state.read_statuses, user_id, nil)

    # Fetch messages after the last_read_message_id
    unread_messages = Telescope.Messages.list_messages_after(state.thread_id, last_read_message_id)

    {:reply, unread_messages, state}
  end

  # Update the join_thread_impl function to load read status
  defp join_thread_impl(user_id, opts, state) do
    # ... existing code ...

    # Load the read status for the user
    read_status = Telescope.Schemas.ThreadReadStatus
    |> Telescope.Repo.get_by(thread_id: state.thread_id, user_id: user_id)

    new_read_statuses = Map.put(state.read_statuses, user_id, read_status && read_status.last_read_message_id)

    {:noreply,
     %{
       state
       | users: [
           user_id
           | Enum.filter(state.users, fn uid -> uid != user_id end)
         ],
         read_statuses: new_read_statuses
     }}
  end

  # Update the handle_cast function to include new message handlers
  def handle_cast({:mark_as_read, user_id, message_id}, state) do
    mark_as_read_impl(user_id, message_id, state)
  end

  def handle_call({:get_unread_messages, user_id}, reply, state) do
    get_unread_messages_impl(user_id, reply, state)
  end

  # ... existing code ...
end

# Add a new module for handling messages
defmodule Telescope.Messages do
  import Ecto.Query

  alias Telescope.Schemas.Message
  alias Telescope.Repo

  def list_messages_after(thread_id, last_read_message_id) do
    query = from m in Message,
      where: m.thread_id == ^thread_id,
      where: m.id > ^last_read_message_id,
      order_by: [asc: m.inserted_at]

    Repo.all(query)
  end

  # ... other message-related functions ...
end
```
