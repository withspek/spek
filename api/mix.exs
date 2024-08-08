defmodule Spek.MixProject do
  use Mix.Project

  def project do
    [
      app: :spek,
      version: "0.1.0",
      elixir: "~> 1.16",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      test_coverage: [tool: ExCoveralls],
      preferred_cli_env: [
        coveralls: :test,
        "coveralls.html": :test
      ],
      elixirc_paths: elixirc_paths(Mix.env()),
      aliases: aliases()
    ]
  end

  def application do
    dev_only_apps = List.wrap(if Mix.env() == :dev, do: :lettuce)
    test_only_apps = List.wrap(if Mix.env() == :test, do: :websockex)

    [
      mod: {Spek, []},
      extra_applications: [:logger, :prometheus_ex] ++ dev_only_apps ++ test_only_apps
    ]
  end

  defp deps do
    [
      {:amqp, "~> 1.0"},
      {:plug_cowboy, "~> 2.7"},
      {:joken, "~> 2.5"},
      {:jason, "~> 1.4"},
      {:ecto_sql, "~> 3.0"},
      {:postgrex, ">= 0.0.0"},
      {:lettuce, "~> 0.3.0", only: :dev},
      {:poison, "~> 5.0"},
      {:oauth2, "~> 2.0"},
      {:prometheus_ex, "~> 3.0"},
      {:prometheus_plugs, "~> 1.1.1"},
      {:finch, "~> 0.18"},
      # style ENFORCEMENT
      {:credo, "~> 1.7", only: [:dev, :test], runtime: false},
      # test helpers
      {:faker, "~> 0.18", only: :test},
      {:websockex, "~> 0.4.3", only: :test},
      {:excoveralls, "~> 0.10", only: :test}
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/_support"]
  defp elixirc_paths(_), do: ["lib"]

  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate", "test"]
    ]
  end
end
