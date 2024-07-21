# SPEK API

## Running Tests

`mix test`

Coverage report: `mix coveralls.html`.
Pretty information outputted into `cover/excoveralls.html`

## Running as Development

1. Install dependencies with `mix deps.get`
2. Run `cp .env.example .envrc` if you're on Mac or Linux
3. Create a GitHub App, Gitlab OAuth application and paste credentials in `.envrc`
4. Compile and build spek `mix do compile, release`
5. Run spek `_build/dev/rel/spek/bin/spek start`

## Autoformatting

`mix format`

## Style ENFORCEMENT

`mix credo --strict`

## ARCHITECTURE

Spek Api will roughly follow "functional core" architecture:

Contexts

1. `Breeze` - Web interface and contexts

2. `Pulse` - OTP-based transient state for Spek

3. `Spek` - OTP Application, Business Logic, and common toolsets

4. `Telescope` - Database, persistent state for Spek

- `Telescope.Access` nonmutating queries
- `Telescope.Mutations` mutating queries
- `Telescope.Queries` composable Ecto.Query fragments
- `Telescope.Schemas` database table schemas
