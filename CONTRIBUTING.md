# Contributing to Spek

> Please read the [PRIORITY LIST](https://github.com/irere123/spek/issues/1969) before contributing.

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting an issue
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Code of Conduct

The code of conduct is described in [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## Our Development Process

All changes happen through pull requests. Pull requests are the best way to propose changes. We actively welcome your pull requests and invite you to submit pull requests directly [here](https://github.com/irere123/spek/pulls), and after review, these can be merged into the project.

## Using the Project's Standard Commit Messages

This project is using the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) standard. Please follow these steps to ensure your
commit messages are standardized:

1. Make sure your shell path is in the root of the project (not inside any of the packages).
2. Stage the files you are commiting with `git add [files]`.
3. Run `git commit -m [commit message]`.

## Pull Requests

1. Fork the repo and create your branch (usually named `patch-%the number of PRs you've already made%`) from `dev`.
2. If you've added code that should be tested, add some test examples.
3. Ensure to describe your pull request.

## Quickstart Local Frontend Development

Do this if you only want to do React stuff and don't want to touch Elixir:

### UI _(react + next.js)_:

Navigate to `/apps/web`

- Run `npm i -g pnpm`
- Run `pnpm`
- Run `pnpm dev` (this turposes)
- Read `spek/README.md` for more information and a fixes for known development issues.

## Translating

1. Set up the front-end (previous step).
2. Go to `spek/public/locales`.
3. Check if a folder with the language you want to add / edit already exists. If not, copy `en/translation`, create the folder and paste it there.
4. Edit the JSON file. Make sure that it's valid.

## Manual Full Local Development

How to run locally:

### Backend

#### PostgreSQL

Install PostgreSQL:

- **macOS**: Run `brew install postgresql`.
- **Windows**: Follow [this](https://www.postgresqltutorial.com/install-postgresql/) guide.
- **Linux**: Follow [this](https://www.postgresqltutorial.com/install-postgresql-linux/) guide.

Start PostgreSQL:

- **macOS**: Run `brew services start postgresql`.
- **Windows**: Start PostgreSQL through the control panel or run `net start postgresql-{version}`.
- **Linux**: Run `/etc/rc.d/init.d/postgresql start`.

Create a DB named `spek_repo`:

```shell
$ psql postgres

$ CREATE DATABASE spek_repo;
```

#### Elixir

Elixir installation guide [here](https://elixir-lang.org/install.html).

#### `spek`

Navigate to `/api` and set the following environment variables:

```
export DATABASE_URL=postgres://user:password@localhost/kousa_repo2
export ACCESS_TOKEN_SECRET=
export REFRESH_TOKEN_SECRET=
export GITHUB_CLIENT_ID=
export GITHUB_CLIENT_SECRET=
export GITLAB_CLIENT_ID=
export GITLAB_CLIENT_SECRET=
export API_URL=http://localhost:4001
export WEB_URL=http://localhost:3000
export PORT=4001
```

> You can save these variables in a `.txt` and run `source path/to/file.txt`

Run the following commands:

```shell
$ mix deps.get
$ mix ecto.migrate
```

Start the server

```shell
$ iex -S mix
```

## Issues

We use GitHub issues to track public bugs. Please ensure your description is
clear and has sufficient instructions to be able to reproduce the issue. Report a bug by <a href="https://github.com/irere123/spek/issues">opening a new issue</a>; it's that easy!

## Frequently Asked Questions (FAQs)

<!--- I thought it would be great to have a list of FAQs for the project to help save time for new contributors--->

    - Q: [The Question?]
    - A: [The Answer!]

## Feature Request

Great Feature Requests tend to have:

- A quick idea summary.
- What & why you wanted to add the specific feature.
- Additional context like images, links to resources to implement the feature etc, etc.

## License

By contributing to Spek, you agree that your contributions will be licensed
under the [LICENSE file](LICENSE).
