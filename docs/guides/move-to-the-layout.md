# Move a project to the layout

How to move the code of an existing project into `src/app/`, `src/features/` and `src/shared/`, one pull request at a time. The words are defined in the [glossary](../reference/glossary.md). Set up the checks first, as [Use the checks in an existing project](existing-project.md) says: check-tree and dependency-cruiser on together, their current errors recorded, and check-exceptions in `npm run check`.

## Find the features first

List what the project does for its user: the screens and routes of a front end, the resources of an API, the commands of a CLI. Each one becomes a folder of `src/features/`, named after what it does (`playlist-playback`, `friend-activity`, `todo-list`), and holds every file that only it uses. A feature never imports another feature.

Write this list down before moving a file. Everything else in the project is either part of one feature or code several features use.

## Then what goes down into shared/

A file goes into `src/shared/` when two features use it and it combines nothing: it imports no other file that would end up in another shared feature. Two moves come out of that rule, and a migration needs both:

- what two features use and that stands alone moves down, into a shared feature named after its concept
- what needs two shared features moves up, into the feature that uses it, because a feature combines shared features and a shared feature never imports another one

The trap is to apply only the first move. Everything used twice goes down, including dialogs, a profile card or a media player that use the theme, the primitives and the API client together. Then shared features import each other, and dependency-cruiser reports every pair.

When two features need the same combination, keep the parts in `src/shared/` and let each feature do the combining: a `TrackPlayer` presenter in the design system gets the track and the actions as props, and each feature that shows a player passes what it read from the API. When the combination is a thing the user sees on its own, it is a feature, and `src/app/` composes it with the others, for instance through a container that passes its state to its `children`.

When the code is shared by the sub-features of one feature only, it goes in the `shared/` of that feature, not in `src/shared/`.

## Name a shared feature after its concept

`todos/`, `theme/`, `dates/`, `api-client/`: a noun of the domain or of the platform. Never a kind, such as `ui/`, `components/`, `hooks/`, `utils/`, `forms/` or `media/`. A folder named after a kind gathers files that do not import each other, and check-tree reports them as separate groups to split. The rule is right: two groups that never import each other are two concepts, so make them two shared features.

## The usual shared features

Most front ends end up with the same few:

- the design system: the theme, the primitives (`Text`, `Pressable`, `Card`) and the generic components built only on them. They import each other, so they form a single group, which the group rule of check-tree accepts as one shared feature, for instance `src/shared/design-system/`
- shared features without UI, which import nothing else from the project: the API client (`api-client/`), the formatting of dates and numbers (`formatting/`), the platform wrappers (`platform/`)
- the domain types and pure functions of a concept that several features read: `src/shared/todos/` with `TodosTypes.ts` and `normalizeTitle.ts`

Whatever mixes the domain with the UI (a playlist card that calls the API, a profile header that reads the session) belongs to a feature, or to the `shared/` of a feature when its sub-features share it.

## Move in this order

1. The shared features without UI. They import nothing else of the project, so moving them only changes the imports that point to them.
2. The design system, which only imports the theme and the primitives it holds.
3. One feature at a time: move its files into `src/features/<name>/`, fix its imports, run `npm run check`, delete the exceptions the move fixed, commit.
4. What is left in the old folders, file by file: one feature uses it, it goes into that feature; two use it and it combines nothing, it goes down; it combines several shared features, it goes up.

Move with `git mv` so that `git log --follow` keeps the history. Keep each pull request to one step or one feature: a reviewer can check a move only when nothing else changed in it.

## Read the errors as instructions

| Message | What it means |
| --- | --- |
| check-tree: `X is only used by src/features/a: move it into src/features/a` | the file went down too early, move it up into that feature |
| check-tree: `src/shared/x holds 2 groups of files that never import each other` | the folder holds two concepts, often because it is named after a kind: split it |
| dependency-cruiser `no-cross-shared` | a file of one shared feature needs another one: it combines two concepts, move it up into the feature that uses it, or merge the two shared features when they are one concept |
| dependency-cruiser `no-cross-feature` | two features share code: move the part they share down, named after its concept |
| dependency-cruiser `app-only-to-features` | `src/app/` reaches a shared feature: wrap what it needs in a feature, such as a page shell |

When a rule rejects a split that looks right, go back to the two moves above before asking for the rule to change. If it still looks wrong, report it with the smallest code that shows it.

## Hand the move to an agent

An agent can do the moves, if it gets them in small batches and `npm run check` decides when a batch is done:

- one batch is one step of the order above, or one feature
- the batch is done when `npm run check` passes and the exception lists only shrank
- the agent never regenerates an exception list. check-exceptions fails when a list grew, which catches the agent that runs `check-tree --write-known-violations` to get green
- the agent stops and asks when a rule seems wrong, instead of disabling it

A prompt for one batch:

```text
Move the playlist-playback feature into src/features/playlist-playback/.
Read docs/guides/move-to-the-layout.md first. A file only this feature uses
goes into it. A file two features use and that imports no other shared code
goes into src/shared/, named after its concept. A file that needs two shared
features stays in the feature. Use git mv. You are done when npm run check
passes. Never rewrite .check-tree-known-violations.json or
.dependency-cruiser-known-violations.json, only delete the entries your move
fixed. If a rule looks wrong, stop and tell me why.
```

The [Claude Code hook](claude-code.md) runs check-tree on each file the agent creates and oxlint on each file it edits, so it sees a misplaced file right away instead of at the end of the batch.
