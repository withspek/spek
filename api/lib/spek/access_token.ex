defmodule Spek.AccessToken do
  use Joken.Config

  # 1 hour
  def token_config, do: default_claims(default_exp: 60 * 60)
end
