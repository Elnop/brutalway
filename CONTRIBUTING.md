# Contributing

How to build, check and release this repository. To use brutalway in a project, start with the [README](README.md) instead.

## Layout

| Folder | |
|---|---|
| `packages/` | the published packages, one npm workspace each |
| `templates/` | template-vite, template-fastify and template-package, each with its own `package.json`, lockfile, version and changelog |
| `site/` | the landing page and the docs, made from template-vite and deployed to GitHub Pages at [brutalway.elnop.dev](https://brutalway.elnop.dev/) |
| `docs/` | the guides, the reference and the concepts, also shown on the site |
| `plugins/`, `.claude-plugin/` | the Claude Code plugin and its marketplace |
| `scripts/` | the script that creates a GitHub release for each published version and each template version |

## Build and check

```sh
nvm use
npm install
npm run build
npm run check
```

The root lints itself with the packages of the workspace, and the tests load the packages through their built `exports`, so `npm run build` comes first. `npm run check` runs Prettier, both tsc projects, oxlint, knip and every test.

`npm run matrix` creates projects covering every pair of CLI option values and runs their `npm run check` and `npm test` (`--all` for every combination). With `--local-packages`, the projects install the `@brutalway/*` packages packed from this checkout instead of the versions on npm, so a rule can be tried on both templates before it is published. CI runs it that way, with `--e2e`.

## Release

Versions are managed with [changesets](https://github.com/changesets/changesets), with two setups: one for the published packages, `create-brutal` included, and one in `templates/` for the templates, which are versioned on their own.

With each change:

- to a published package, add a changeset with `npx changeset`
- to a template, when it matters to someone starting a project, add one with `npm run templates:changeset`

To release:

1. Commit the template changes first: the CLI records the last commit that changed each template when it is built.
2. `npx changeset version` bumps the package versions and writes their changelogs.
3. `npm run templates:version` bumps the template versions and writes their `CHANGELOG.md`.
4. `npm run release` builds, checks, publishes what changed, tags the templates as `template-vite@x.y.z` and so on, and creates every GitHub release.

The site shows each template changelog on the template's page.

## The site

`site/` has its own `package.json` and its own `npm run check`. The Pages workflow deploys it on each push that changes it.

## The roadmap

The [roadmap](https://brutalway.elnop.dev/#/docs/brutalway/roadmap) is read from the issues each time the page opens, so the issues are the only thing to keep up to date. An open issue shows up once it carries one of these labels:

- `triage`: opened by someone outside the project and not read yet, listed apart from the rest
- `todo`: accepted, not started
- `in progress`

The Issue status workflow keeps these labels and the Status field of the project board in sync. It gives `todo` to an issue opened by a collaborator and `triage` to any other, and puts the issue on the board. Adding a status label moves the card and removes the previous label at once. Moving a card is picked up within five minutes, by a run that compares both sides and keeps the most recent change, and a card moved to Done closes its issue. Accepting an issue from triage means giving it `todo`, or moving its card to Todo. The workflow writes to the board with `PROJECT_TOKEN`, a classic token with the `project` scope stored as a secret of the repository. A closed issue shows up under Done, unless it was closed as not planned or carries `duplicate`, `invalid` or `wontfix`. Sub-issues are listed under their parent.
