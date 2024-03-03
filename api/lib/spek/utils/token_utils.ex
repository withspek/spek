defmodule Spek.Utils.TokenUtils do
  alias Models.User

  def tokens_to_user_id(access_token!, refresh_token) do
    access_token! = access_token! || ""

    case Spek.AccessToken.verify_and_validate(access_token!) do
      {:ok, claims} ->
        {:existing_claim, claims["userId"]}

      _ ->
        verify_refresh_token(refresh_token)
    end
  end

  defp verify_refresh_token(refresh_token!) do
    refresh_token! = refresh_token! || ""

    case Spek.RefreshToken.verify_and_validate(refresh_token!) do
      {:ok, refreshClaims} ->
        user = Spek.Repo.get(User, refreshClaims["userId"])

        if user &&
             user.tokenVersion == refreshClaims["tokenVersion"] do
          {:new_tokens, user.id, create_tokens(user), user}
        end

      _ ->
        nil
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
