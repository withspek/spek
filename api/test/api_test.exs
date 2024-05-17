defmodule ApiTest do
  use ExUnit.Case, async: true

  def add(a, b) do
    a + b
  end

  test "greets the world" do
    result = add(2, 3)
    assert result == 5
  end
end
