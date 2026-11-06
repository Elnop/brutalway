# Changesets

Each change to a published package comes with a changeset: run `npx changeset`, pick the packages and the bump, and describe the change. `npx changeset version` applies the pending changesets to the versions and changelogs, and `npm run release` publishes.

The templates (`templates/vite`, `templates/fastify`) have their own changesets, in their own repositories. Run `npx changeset` there when a change matters to someone starting a project. On each push to `main`, their Release workflow opens a `chore: release` pull request, and merging it writes the `CHANGELOG.md`, bumps the version and pushes the `vX.Y.Z` tag. The site shows that `CHANGELOG.md` on the template's page.
