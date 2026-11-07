# Changesets

Each change to a published package comes with a changeset: run `npx changeset`, pick the packages and the bump, and describe the change. `npx changeset version` applies the pending changesets to the versions and changelogs, and `npm run release` publishes.

The templates (`templates/vite`, `templates/fastify`) are not npm workspaces, so they have their own changesets in `templates/.changeset/`, where `templates/lerna.json` lists them for changesets. Run `npm run templates:changeset` when a change matters to someone starting a project, and `npm run templates:version` to write each template's `CHANGELOG.md` and bump its version. `npm run release` pushes the `template-vite@x.y.z` and `template-fastify@x.y.z` tags along with the others. The site shows each `CHANGELOG.md` on the template's page.
