# Changesets

Each change to a published package comes with a changeset: run `npm run changeset` from the root, pick the packages and the bump, and describe the change. `npm run version` applies the pending changesets to the versions and changelogs, and `npm run release` publishes.

`packages/lerna.json` lists the package folders for changesets, since they are not npm workspaces. `bumpVersionsWithWorkspaceProtocolOnly` keeps changesets from touching the ranges between packages: each package depends on the others through npm and raises its ranges itself.

The templates have their own changesets in `templates/.changeset/`, where `templates/lerna.json` lists them. Run `npm run templates:changeset` when a change matters to someone starting a project, and `npm run templates:version` to write each template's `CHANGELOG.md` and bump its version. `npm run release` pushes the `template-vite@x.y.z`, `template-fastify@x.y.z` and `template-package@x.y.z` tags along with the others. The site shows each `CHANGELOG.md` on the template's page.
