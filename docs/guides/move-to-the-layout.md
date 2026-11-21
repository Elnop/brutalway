# Move a project to the layout

How to move the code of an existing project into `src/app/`, `src/features/` and `src/shared/`, one pull request at a time. The words are defined in the [glossary](../reference/glossary.md). Set up the checks first, as [Use the checks in an existing project](existing-project.md) says: check-tree and dependency-cruiser on together, their current errors recorded, and check-exceptions in `npm run check`. On a project laid out another way, that list holds most folders of `src/` at the start: each move below shortens it.

## Find the features first

List what the project does for its user: the screens and routes of a front end, the resources of an API, the commands of a CLI. Each one becomes a folder of `src/features/`, named after what it does (`playlists`, `playback`, `friend-activity`), and holds every file that only it uses. A feature never imports another feature.

Write this list down before moving a file. Everything else in the project is either part of one feature or code several features use.

A feature that covers several things the user does, such as `playlists` with its list, its detail screen and its editor, gets sub-features: `src/features/playlists/features/detail/`, `src/features/playlists/features/editor/`. Nest when the parts are distinct for the user and share code among themselves that nothing outside the feature needs. Each level works like the top one: what two sub-features use and that stands alone goes down into the `shared/` of their parent, what combines two of those goes up into the sub-feature that uses them.

## Then what goes down into shared/

A file goes into `src/shared/` when two features use it and it combines nothing: it imports no other file that would end up in another shared feature. Two moves come out of that rule, and a migration needs both:

- what two features use and that stands alone moves down, into a shared feature named after its concept
- what needs two shared features moves up, into the feature that uses it, because a feature combines shared features and a shared feature never imports another one

The trap is to apply only the first move. Everything used twice goes down, including dialogs, a profile card or a media player that use the theme, the primitives and the API client together. Then shared features import each other, and dependency-cruiser reports every pair.

When two features need the same combination, keep the parts in `src/shared/` and let each feature do the combining: a `TrackPlayer` presenter in the design system gets the track and the actions as props, and each feature that shows a player passes what it read from the API. When the combination is something the user sees on its own, it is a feature, and `src/app/` composes it with the others, as [Compose features in src/app/](#compose-features-in-srcapp) shows.

The same split applies inside one component:

- frame down, content up: the backdrop and the centering of a dialog go into the design system, the dialog that reads a store goes into a feature
- imperative API down, renderer up: for a `showAlert()` callable from anywhere, the store and the function, with no UI, go into `src/shared/alerts/`, and the component that renders the alert goes into a feature that `src/app/` mounts once

## Name a shared feature after its concept

`todos/`, `theme/`, `dates/`, `api-client/`: a noun of the domain or of the platform. Never a kind, such as `ui/`, `components/`, `hooks/`, `utils/`, `forms/` or `media/`. A folder named after a kind gathers files that do not import each other, and check-tree reports them as separate groups to split. The rule is right: two groups that never import each other are two concepts, so make them two shared features.

## The usual shared features

Most front ends end up with the same few:

- the design system: the theme, the primitives (`Text`, `Pressable`, `Card`) and the presenters built only on them. They import each other, so they form a single group, which the group rule of check-tree accepts as one shared feature, for instance `src/shared/design-system/`
- shared features without UI, which import nothing else from the project: the API client (`api-client/`), the formatting of dates and numbers (`formatting/`), the platform wrappers (`platform/`)
- the domain types and pure functions of a concept that several features read: `src/shared/todos/` with `TodosTypes.ts` and `normalizeTitle.ts`

A presenter that two features share and that only needs the theme goes into the design system, even with a domain name like `ArtistLine` or `GenreChip`, since a shared feature cannot import the theme from next door. It stays there as long as it gets its data through props and imports nothing but the design system. As soon as it reads a store, calls the API client or imports another shared feature, it combines two concepts and goes up into a feature.

Whatever mixes the domain with the UI (a playlist card that calls the API, a profile header that reads the session) belongs to a feature, or to the `shared/` of a feature when its sub-features share it.

## State

A store that a single feature reads lives in that feature, in its `shared/` when several of its sub-features read it. A store that two features read goes down only if it combines nothing: a store that calls the API client already combines two concepts, so it stays in the feature that owns the data, and the other features get its state through `src/app/`, as the next section shows.

## Compose features in src/app/

Features never import each other, so `src/app/` connects them. Three patterns cover most cases:

- a container passes its state to its `children`, and containers nest: a screen of `src/app/` renders `PlanContainer`, which renders `PlaylistPlaybackContainer`, which renders `PlaylistDetailContainer` with what both gave it
- `src/app/` injects a component: it passes `TrackActionsSheet` as a prop to the playlists feature and to the queue of the playback feature, so neither imports the other
- the contract goes down, the implementation stays: the type of the `playback` prop, `PlaybackActions`, lives in `src/shared/playback/`. The playlists feature types its prop with it, the playback feature implements it, and `src/app/` passes one to the other. Moving the implementation down instead would make a shared feature that calls the API and reads a store

## Inside a feature

A feature holds its files at its root until two files share a kind: two hooks go into `hooks/`, two type files into `types/`, two pure functions into `lib/`. In `components/`, orchestrators (`XContainer`, `XLayout`, `XPage`) and presenters split into `orchestrators/` and `presenters/` the same way. A folder with a single child is folded back into its parent. The [glossary](../reference/glossary.md) defines each kind, and the [check-tree README](../../packages/tools/check-tree/README.md) lists the folder names it knows.

## Move in this order

1. The shared features without UI. They import nothing else of the project, so moving them only changes the imports that point to them.
2. The design system, which only imports the theme and the primitives it holds.
3. One feature at a time: move its files into `src/features/<name>/`, fix its imports, run `npm run check`, delete the exceptions the move fixed, commit.
4. What is left in the old folders, file by file: one feature uses it, it goes into that feature; two use it and it combines nothing, it goes down; it combines several shared features, it goes up.

Until step 4, a moved feature may still import files from the old folders. check-tree reports these folders as not part of the layout, and they stay in its list until they are empty.

Move with `git mv` so that `git log --follow` keeps the history, and change nothing in a moved file but its imports: split or rewrite it in the next pull request. A file moved and rewritten in the same commit no longer looks like a rename to git, and the history stops there. With aliases instead of relative imports, a moved file keeps its own imports, and only the files that import it change. A file that mixes two concepts, such as a `types.ts` with the types of two features, gets split by concept in its own pull request before the move. `git mv` leaves behind the folders it emptied and those you created for nothing: delete them, or check-tree reports them.

Keep each pull request to one step or one feature: a reviewer can check a move only when nothing else changed in it.

A move changes the exception lists: the path of a moved folder in `.check-tree-known-violations.json`, a glob of `.jscpd.json` or `knip.json`, the count of a folder that lost files. Update them in the same commit. `npx oxlint --type-aware --prune-suppressions`, `npx check-tree src --shrink-known-violations`, `npx depcruise src --baseline --baseline-mode shrink-only` and `npx alint baseline` delete the entries that no longer happen and lower the counts. A moved folder that still breaks a rule is reported under its new path: change the path of its entry by hand. The globs of jscpd and knip are edited by hand too. check-exceptions counts per rule over the whole project, not per path, so a list whose paths changed but whose size did not still passes.

Test helpers shared by several tests go in `test-utils/` at the root of the project, next to `src/`, behind an alias such as `@test-utils/` declared in the tsconfig and in the config of the test runner. dependency-cruiser rejects an import of `test-utils/` from production code.

## Read the errors as instructions

| Message | What it means |
| --- | --- |
| check-tree: `X is only used by src/features/a: move it into src/features/a` | the file went down too early, move it up into that feature |
| check-tree: `src/shared/x holds 2 groups of files that never import each other` | the folder holds two concepts, often because it is named after a kind: split it |
| check-tree: `src/features/a holds 2 hooks files (...): move them into hooks/` | two files of one kind: they go into the kind folder |
| check-tree: `src/features/a/hooks holds a single child: move it up one level and delete the folder` | a kind folder with one file: the file goes back to the root of its folder |
| check-tree: `src/features/a/hooks is empty: delete it` | a move left the folder empty |
| check-tree: `.check-tree-known-violations.json lists kind-folder for src/pages, which no longer happens: delete the entry or run check-tree with --shrink-known-violations` | a move fixed a recorded violation: delete its entry |
| check-tree: `.check-tree-known-violations.json lists shared-feature-groups for src/shared/ui with a count of 9, which is now 8: lower it or run check-tree with --shrink-known-violations` | a move fixed part of a recorded violation: lower its count |
| dependency-cruiser `no-cross-shared` | a file of one shared feature needs another one: it combines two concepts, move it up into the feature that uses it, or merge the two shared features when they are one concept |
| dependency-cruiser `no-cross-feature` | two features share code: move the part they share down, named after its concept, or connect them in `src/app/` |
| dependency-cruiser `app-only-to-features` | `src/app/` reaches a shared feature: wrap what it needs in a feature, such as a page shell that renders the frame of every page |

When a rule rejects a split that looks right, go back to the two moves above before asking for the rule to change. If it still looks wrong, report it with the smallest code that shows it.

## Hand the move to an agent

An agent can do the moves, if it gets them in small batches and `npm run check` decides when a batch is done:

- one batch is one step of the order above, or one feature
- the batch is done when `npm run check` passes and the exception lists only shrank: paths changed, counts lowered, entries deleted. `oxlint --prune-suppressions`, `check-tree --shrink-known-violations`, `depcruise --baseline-mode shrink-only` and `alint baseline` do the last two
- the agent never regenerates an exception list. check-exceptions fails when a list grew, which catches the agent that runs `oxlint --suppress-all` or `check-tree --write-known-violations` to get green
- the agent stops and asks when a rule seems wrong, instead of disabling it

A prompt for one batch:

```text
Move the playback feature into src/features/playback/.
Read docs/guides/move-to-the-layout.md first. A file only this feature uses
goes into it. A file two features use and that imports no other shared code
goes into src/shared/, named after its concept. A file that needs two shared
features stays in the feature. Use git mv and change nothing in a moved file
but its imports. You are done when npm run check passes. Run
npx oxlint --type-aware --prune-suppressions,
npx check-tree src --shrink-known-violations,
npx depcruise src --baseline --baseline-mode shrink-only and
npx alint baseline, then update by hand
the paths of what you moved in the exception lists. Never add or raise an
entry. If a rule looks wrong, stop and tell me why.
```

Several agents working in parallel all touch the same exception lists, and every merge conflicts there. Resolve it by taking the version of the main branch, removing the entries your branch fixed, and running the checks again.

The [Claude Code hook](claude-code.md) runs check-tree on each file the agent creates and oxlint on each file it edits, so it sees a misplaced file right away instead of at the end of the batch.
