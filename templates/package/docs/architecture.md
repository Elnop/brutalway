# Architecture

The intent behind every template of the series and the general principles they borrow from (Feature-Sliced Design, Screaming Architecture, fitness functions...) are in [the brutalway docs](https://github.com/Elnop/brutalway/tree/main/docs). This page covers what is specific to a published package.

## Entry points at the root

A package has a public surface: the commands of `bin` and the paths of `exports` in `package.json`. Each one is a file at the root of `src/`, named after what it is (`src/todo.ts` for the `todo` command, `src/todos.ts` for the `"."` export), and `tsdown.config.ts` builds each of them into `dist/`.

We take the role that the `app` layer plays in an app: an entry point composes the features and nothing else imports it. A feature that needs code from an entry point gets it from a shared feature instead. A file at the root of `src/` is then always part of the public surface, and moving code behind it never changes what users import.

We leave out the `index.ts` that re-exports the whole tree, and the `app` layer itself, which a package does not need.

Enforced by `@brutalway/dependency-cruiser-config/library` (nothing but a test imports a file at the root of `src/`, no `app` folder under `src/`) and `check-tree --root-entries`, which leaves those files where they are whatever their kind.

## Ranges for users, exact versions for the repository

A library shares its runtime dependencies with the project that installs it. Exact versions there would install a second copy each time the two disagree on a patch.

We take ranges for `dependencies` and `peerDependencies`, and keep exact versions for `devDependencies`, which only this repository installs. The example needs no runtime dependency.

Enforced by `@brutalway/alint-config/library.yml`.

## Test the published surface

Tests sit next to their source, and each entry point also gets a test that uses it the way a user does. `src/todo.test.ts` runs `node src/todo.ts` in a temporary folder and compares the exact output and exit code. `src/todos.test.ts` checks the names the export offers and calls them together on one file.

We leave out tests of the built `dist/`, which would make `npm test` wait for a build. tsdown builds the same files the tests run.

## Releases from changesets

From [changesets](https://github.com/changesets/changesets): each change worth a release comes with a file in `.changeset/` naming the bump and describing it, and the version and the changelog are written from those files.

We take the release pull request of `changesets/action` and npm trusted publishing with provenance, so no npm token is stored in the repository. We leave out publishing from a developer machine after the first version.
