defmodule Spek.AccessToken do
  alias Joken.Signer
  use Joken.Config

  def token_config() do
    %{}
    |> add_claim("exp", fn -> 60 * 60 end, &(&1 == 60 * 60))
  end

  def sign!(data) do
    signer =
      Signer.create("HS256", "secret", %{
        "userId" => data["userId"]
      })

    {:ok, token, _claims} = Joken.encode_and_sign(%{}, signer)
    token
  end
end
