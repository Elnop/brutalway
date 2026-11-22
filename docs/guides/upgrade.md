# Upgrade brutalway

A new version of a `@brutalway/*` package can add a rule, change a default or change a message. A new version of a template can move files, add a check or change a config. This guide covers both.

## After bumping a package

The templates, and any project that uses `@brutalway/alint-config`, pin every dependency to an exact version, so a bump is a change to `package.json` you make on purpose, in a pull request of its own:

1. Read what changed: each package has a GitHub release, such as [`@brutalway/check-tree@0.13.0`](https://github.com/Elnop/brutalway/releases/tag/%40brutalway%2Fcheck-tree%400.13.0), with the text of its changesets. A release that adds a rule or changes a default says so, and says what to do in a project.
2. Run `npm run check`.
3. For each new error, fix the code, or record it as an exception if the fix is a refactor of its own. A rule that did not exist on the main branch starts at 0 for check-exceptions: write the number of violations under `newRules` in `package.json` in that pull request, and delete the entry once it is merged into the main branch, as the [check-exceptions README](../../packages/tools/check-exceptions/README.md) says.
4. When a release changes the format of an exception list, rewrite the list with the new version of the tool. check-tree 0.13.0 did so for `.check-tree-known-violations.json`: run `npx check-tree src --write-known-violations` once, check in the diff that no entry was added and no count raised, and commit it. check-tree 0.14.0 fails on a count higher than the current one: run `npx check-tree src --shrink-known-violations` once and commit the diff.

Bump the packages one at a time when you can: a pull request that bumps one package and fixes what it reports is easy to review, ten bumps at once are not.

When a new rule rejects code you think is right, do not disable it in silence. Open an issue with the package, its version, the smallest code that shows it and the message.

## Take the changes of a template

This section is for a project made with `npm create brutal`. A project that installed the packages by hand only has the bumps above.

A project made with `npm create brutal` does not follow its template on its own: once created, the code is yours. create-brutal records the version that made the project and the answers given in `.brutalway.json`, and merges what changed since then:

```sh
npx create-brutal@latest update
```

It refuses to run on a working tree with changes. It generates the project as the recorded version made it and as the current version makes it, with the same answers, and merges the difference into your working tree with git, the way `git cherry-pick` does. What you changed and the template did not stays as it is, and a file the template renamed keeps your edits. Where both sides changed the same lines, the file holds conflict markers to resolve. A file you deleted and the template changed shows up as `deleted by us` in `git status`: keep it deleted with `git rm` or take it back with `git add`.

`package.json` is merged key by key: a script or a dependency the template changed and you did not takes the template's value, and when both sides changed the same key the command keeps yours and names it. The lockfile is left alone: run `npm install` afterwards. Then run `npm run check`, fix what the new checks report, and commit.

From create-brutal 0.17.0, the `check` script of a template is `brutal-check`, which runs one script per check. If you had added your own checks to the old `check` line, `update` keeps your line and names it: set it to `brutal-check` followed by your checks, such as `"check": "brutal-check && npm run lint:sql"`. A release that adds a check then adds a script and bumps `@brutalway/check`, which merge without a conflict.

- `--to <version>` targets another version than the one running the command.
- `--set <option>=<value>` changes an answer during the update, to turn an option on or off later: `--set e2e=false`.
- `npx create-brutal@latest check` exits with 1 when the current version would change the project, for a scheduled CI job.

The `brutal-skills` Claude Code plugin has a skill that runs the update, resolves the conflicts with you and brings `npm run check` back to where it was. Install it with `/plugin install brutal-skills --marketplace Elnop/brutalway`, then run `/brutal-skills:brutalway-update`.

### A project made before .brutalway.json

create-brutal writes `.brutalway.json` since 0.16.0. For an older project, give the version and the stack that made it, and the options that differ from the defaults of that version:

```sh
npx create-brutal@latest update --from 0.14.0 --stack fastify --set swagger=false
```

To find the version, take the date of the first commit (`git log --reverse --format=%ad | head -1`) and the last `create-brutal` release before it on the [releases page](https://github.com/Elnop/brutalway/releases). The command regenerates that version first and prints how many of its files are unchanged in the project. It refuses when fewer than half of them exist, which means the version, the stack or the options are wrong.

## For maintainers

A changeset that adds a rule, makes a rule stricter or changes a default says so in its first sentence, and says what a project does about it: fix the code, run a command, or add an entry under `newRules`. The release notes are built from these texts, so they are the only place a project learns about the change. [CONTRIBUTING.md](../../CONTRIBUTING.md#release) has the rest of the release process.
