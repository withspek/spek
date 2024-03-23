defmodule Spek.Utils.TokenUtils do
  alias Models.User

  def tokens_to_user_id(accessToken, refreshToken) do
    accessToken = if is_nil(accessToken), do: "", else: accessToken
    refreshToken = if is_nil(refreshToken), do: "", else: refreshToken

    case Spek.AccessToken.verify_and_validate(
           accessToken,
           Joken.Signer.create("HS256", "secret")
         ) do
      {:ok, claims} ->
        {claims["userId"], nil}

      _ ->
        case Spek.RefreshToken.verify_and_validate(refreshToken) do
          {:ok, refreshClaims} ->
            user = User |> Spek.Repo.get(refreshClaims["userId"])

            if is_nil(user) or user.tokenVersion != refreshClaims["tokenVersion"] do
              {nil, nil}
            else
              {user.id, create_tokens(user), user}
            end

          _ ->
            {nil, nil}
        end
    end
  end

  def create_tokens(user) do
    %{
      accessToken:
        Spek.AccessToken.generate_and_sign!(
          %{
            "userId" => user.id
          },
          Joken.Signer.create("HS256", "secret")
        ),
      refreshToken:
        Spek.RefreshToken.generate_and_sign!(
          %{
            "userId" => user.id,
            "tokenVersion" => user.tokenVersion
          },
          Joken.Signer.create("HS256", "refreshsecret")
        )
    }
  end
end
