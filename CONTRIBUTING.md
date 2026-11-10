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

Versions are managed with [changesets](https://github.com/changesets/changesets): add one with `npx changeset` for each change to a published package, `create-brutal` included. `npx changeset version` bumps the versions and writes the changelogs, then `npm run release` builds, checks, publishes what changed and creates the GitHub releases. The CLI records the last commit that changed each template when it is built, so commit the template changes before releasing.

The templates are versioned on their own, with a second changesets setup in `templates/`: `npm run templates:changeset` adds a changeset for a change that matters to someone starting a project, and `npm run templates:version` bumps the template versions and writes their `CHANGELOG.md`. `npm run release` then tags them as `template-vite@x.y.z` and `template-fastify@x.y.z` and creates their GitHub releases. The site shows each changelog on the template's page.

## The site

`site/` has its own `package.json` and its own `npm run check`. The Pages workflow deploys it on each push that changes it.

The work left is in [docs/roadmap.md](docs/roadmap.md).
