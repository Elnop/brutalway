# Publishing

Versions are recorded with [changesets](https://github.com/changesets/changesets). With each change worth a release, run `npx changeset`, pick the bump and describe the change: it writes a file in `.changeset/` that goes in the same commit.

`.github/workflows/release.yml` runs on every push to `main`, after `npm run check` and `npm test`. While `.changeset/` holds changes, it opens a "Version Packages" pull request that bumps the version and writes `CHANGELOG.md`. Once that pull request is merged, it runs `npm run release`, which publishes the new version to npm and pushes its `v<version>` tag and GitHub release.

The workflow uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers): GitHub Actions proves its identity to npm, so no `NPM_TOKEN` secret is stored, and each version gets its provenance statement. npmjs.com only lets you add a trusted publisher to a package that exists, so publish the first version by hand with `npm publish`, then in the package settings on npmjs.com add a trusted publisher for this repository and the `release.yml` workflow. In the repository settings on GitHub, under Actions, allow GitHub Actions to create pull requests.
