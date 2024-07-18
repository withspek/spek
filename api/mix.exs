defmodule Spek.MixProject do
  use Mix.Project

  def project do
    [
      app: :spek,
      version: "0.1.0",
      elixir: "~> 1.16",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      elixirc_paths: elixirc_paths(Mix.env()),
      aliases: aliases()
    ]
  end

  def application do
    dev_only_apps = List.wrap(if Mix.env() == :dev, do: :lettuce)

    [
      mod: {Spek, []},
      extra_applications: [:logger, :prometheus_ex] ++ dev_only_apps
    ]
  end

  defp deps do
    [
      {:plug_cowboy, "~> 2.7"},
      {:joken, "~> 2.5"},
      {:jason, "~> 1.4"},
      {:ecto_sql, "~> 3.0"},
      {:postgrex, ">= 0.0.0"},
      {:lettuce, "~> 0.3.0", only: :dev},
      {:poison, "~> 5.0"},
      {:oauth2, "~> 2.0"},
      {:prometheus_ex, "~> 3.0"},
      {:prometheus_plugs, "~> 1.1.1"}
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate", "test"]
    ]
  end
end
