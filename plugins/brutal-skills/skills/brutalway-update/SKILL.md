---
name: brutalway-update
description: Update a project made with create-brutal to the current version of its template, resolve the merge conflicts and bring npm run check back to where it was. Use when the user asks to update, upgrade or sync the project with its brutalway template.
disable-model-invocation: true
argument-hint: '[--to <version>] [--set <option>=<value>]'
---

# Update the project from its template

`create-brutal update` regenerates the project as the recorded version made it and as the target version makes it, with the answers recorded in `.brutalway.json`, and merges the difference into the working tree with git. Your job is what the command cannot do: resolve the conflicts and fix what the new checks report.

## 1. Before the update

1. Run `git status`. The command refuses a working tree with changes: ask the user to commit or stash them, never stash them yourself.
2. Run `npm run check` and write down which checks fail and how many errors each prints. That is the baseline: after the update, nothing may fail that did not fail before.

## 2. Run the update

Run `npx create-brutal@latest update $ARGUMENTS` at the root of the project.

- If `.brutalway.json` is missing, the project was made before create-brutal recorded it. Ask the user which version and stack made the project and which options they chose, then run `npx create-brutal@latest update --from <version> --stack <id> --set <option>=<value> ...`. The command refuses when the files of that version do not match the project: do not force another version, ask again.
- `--set <option>=<value>` turns an option on or off during the update. Only pass it when the user asked for it.

## 3. Resolve the conflicts

The command lists the files in conflict. They hold git conflict markers: the project's version between `<<<<<<<` and `=======`, the template's version between `=======` and `>>>>>>>`.

For each file:

1. Read the changelog of the template between both versions, `templates/<stack>/CHANGELOG.md` in https://github.com/Elnop/brutalway, to know why the template changed that part.
2. Keep what the project changed on purpose and take what the template changed, combining both when they touch different things. When both rewrote the same lines with different intents, ask the user.
3. A file deleted in the project and changed in the template (`deleted by us` in `git status`) is a choice for the user: show what the template changed and ask whether to keep it deleted (`git rm`) or take it back (`git add`).
4. `git add` the file once no marker is left.

The command also names the keys of `package.json` that both sides changed. It kept the project's value: compare with the template's value and keep the project's only when the user changed it on purpose, such as a pinned dependency.

## 4. Bring the checks back

1. Run `npm install`.
2. Run `npm run check`. Fix every error that the baseline did not have, by changing the code, not by adding an exception: a new rule of the template is the point of the update.
3. Run `npm test`.

Stop and ask the user when a fix needs a decision you cannot take from the code, such as moving a feature or dropping a dependency.

## 5. Commit

Commit everything in one commit, `chore: update the project to create-brutal <version>`: the pre-commit hook runs `npm run check`, so the merge and the fixes go in together. Never commit with conflict markers left, never pass `--no-verify`, and never rewrite `.brutalway.json` by hand.
