defmodule Spek.RefreshToken do
  use Joken.Config

  # 30 days
  def token_config, do: default_claims(default_exp: 60 * 60 * 24 * 30)
end
