defmodule Spek.MixProject do
  use Mix.Project

  def project do
    [
      app: :spek,
      version: "0.1.0",
      elixir: "~> 1.16",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      elixirc_paths: elixirc_paths(Mix.env())
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    dev_only_apps = List.wrap(if Mix.env() == :dev, do: :lettuce)

    [
      mod: {Spek, []},
      extra_applications: [:logger] ++ dev_only_apps
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:plug_cowboy, "~> 2.7"},
      {:joken, "~> 2.5"},
      {:jason, "~> 1.4"},
      {:ecto_sql, "~> 3.0"},
      {:postgrex, ">= 0.0.0"},
      {:lettuce, "~> 0.3.0", only: :dev},
      {:oauth2, "~> 2.0"}
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]
end
