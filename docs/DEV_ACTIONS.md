# Dev Actions

We have a set of actions that we can perform to help us develop and maintain the project. These actions are documented
in the `docs/DEV_ACTIONS.md` file.

## Table of Contents

- [Triager](#triager)
- [Format](#format)
- [Linter](#linter)
- [Greetings](#greetings)

## Triager

The triager is a Github Action that automatically assigns the `triage` label to new issues and pull requests that are
created by open-source contributors.

## Format

We use [Prettier](https://prettier.io/) to format our code. Prettier is an opinionated code formatter that enforces a
consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into
account, wrapping code when necessary. We have a Github Action that runs Prettier on every pull request and commits the
new formats if necessary. Still, it's a good practice to run Prettier locally before pushing your changes or even having
it running automatically in your IDE. Find more on setting up Prettier in our [FORMATTING.md](FORMATTING.md), in combination with Nx.

## Linter

We use [ESLint](https://eslint.org/) to lint our code, in combination with Nx. ESLint is a tool for identifying and reporting on patterns found
in JavaScript code, with the goal of making code more consistent and avoiding bugs. We have a Github Action that runs
ESLint on every pull request and alerts us if there are any errors.

## Greetings

The greetings action is a simple action that sends a greeting message to the user that triggered the action. It is used
to make the new contributors feel welcome and make them aware of the guidelines and best practices.

## Release

We have a fully automated release process that is triggered by a Github Action. The release process is based on the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. The action gets triggered when pushing the latest changes to `master` branch. It publishes a new Github release with the latest changes and updates the `CHANGELOG.md` file, also it publishes the new apps to our servers (Github Pages).
