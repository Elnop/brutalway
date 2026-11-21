# Upgrade brutalway

A new version of a `@brutalway/*` package can add a rule, change a default or change a message. A new version of a template can move files, add a check or change a config. This guide covers both.

## After bumping a package

The templates, and any project that uses `@brutalway/alint-config`, pin every dependency to an exact version, so a bump is a change to `package.json` you make on purpose, in a pull request of its own:

1. Read what changed: each package has a GitHub release, such as [`@brutalway/check-tree@0.13.0`](https://github.com/Elnop/brutalway/releases/tag/%40brutalway%2Fcheck-tree%400.13.0), with the text of its changesets. A release that adds a rule or changes a default says so, and says what to do in a project.
2. Run `npm run check`.
3. For each new error, fix the code, or record it as an exception if the fix is a refactor of its own. A rule that did not exist on the main branch starts at 0 for check-exceptions: write the number of violations under `newRules` in `package.json` in that pull request, and delete the entry once it is merged into the main branch, as the [check-exceptions README](../../packages/tools/check-exceptions/README.md) says.
4. When a release changes the format of an exception list, rewrite the list with the new version of the tool. check-tree 0.13.0 did so for `.check-tree-known-violations.json`: run `npx check-tree src --write-known-violations` once, check that the diff only changes the format, and commit it.

Bump the packages one at a time when you can: a pull request that bumps one package and fixes what it reports is easy to review, ten bumps at once are not.

When a new rule rejects code you think is right, do not disable it in silence. Open an issue with the package, its version, the smallest code that shows it and the message.

## Take the changes of a template

A project made with `npm create brutal` does not follow its template: once created, the code is yours, and nothing updates it. To take what changed in the template since then:

1. Find the version you started from. `create-brutal` does not record it, so look at the date of the first commit (`git log --reverse --format=%ad | head -1`) and pick the last release of the template before that date on the [releases page](https://github.com/Elnop/brutalway/releases), for instance `template-vite@0.10.7`.
2. Read the changelog of the template between that version and the current one: `templates/vite/CHANGELOG.md` in the brutalway repository lists each release with what changed and why.
3. Compare the two tags on GitHub to see the files: `https://github.com/Elnop/brutalway/compare/template-vite@0.10.7...template-vite@0.11.0`, then look at `templates/vite/` in the diff.
4. Take the changes you want by hand, one topic per pull request: a new check in `npm run check`, a config, a doc of `docs/reference/`. Leave out what touches the example app if you deleted it.

The tags name the templates, not the options of `create-brutal`: a change to a file that an option removes or rewrites does not apply as is to a project created without that option.

## For maintainers

A changeset that adds a rule, makes a rule stricter or changes a default says so in its first sentence, and says what a project does about it: fix the code, run a command, or add an entry under `newRules`. The release notes are built from these texts, so they are the only place a project learns about the change. [CONTRIBUTING.md](../../CONTRIBUTING.md#release) has the rest of the release process.
