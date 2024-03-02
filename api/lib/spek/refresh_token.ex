defmodule Spek.RefreshToken do
  alias Joken.Signer
  use Joken.Config

  def token_config() do
    %{}
    |> add_claim("exp", fn -> 60 * 60 * 24 * 30 end, &(&1 == 60 * 60 * 24 * 30))
  end

  def sign!(data) do
    signer =
      Signer.create("HS256", "refreshsecret", %{
        "userId" => data["userId"],
        "tokenVersion" => data["tokenVersion"]
      })

    {:ok, token, _claims} = Joken.encode_and_sign(%{}, signer)
    token
  end
end
