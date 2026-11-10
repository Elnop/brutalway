# Publishing

Versions are recorded with [changesets](https://github.com/changesets/changesets) and published by `.github/workflows/release.yml`, with [npm trusted publishing](https://docs.npmjs.com/trusted-publishers): no `NPM_TOKEN` secret is stored, and each version gets its provenance statement.

## Set it up once

1. Publish the first version by hand with `npm publish`. npmjs.com only lets you add a trusted publisher to a package that exists.
2. In the package settings on npmjs.com, add a trusted publisher for this repository and the `release.yml` workflow.
3. In the repository settings on GitHub, under Actions, allow GitHub Actions to create pull requests.

## Release a change

1. With each change worth a release, run `npx changeset`, pick the bump and describe the change. It writes a file in `.changeset/` that goes in the same commit.
2. On each push to `main`, after `npm run check` and `npm test`, the workflow opens or updates a "Version Packages" pull request that bumps the version and writes `CHANGELOG.md`.
3. Merge that pull request. The workflow runs `npm run release`, which publishes the new version to npm and pushes its `v<version>` tag and GitHub release.
