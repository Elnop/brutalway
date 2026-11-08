# E0. Options that add things and options with several values

The `Answers` type is `Record<string, boolean>` and every option defaults to `true`. A styling option has three values (plain CSS, CSS Modules, Tailwind) and a translation option should default to off.

**E0-S1. Choice options.** As someone creating a project, I want to pick one value out of several for an option, so that I can choose my styling system in one question.
- `StackOption` accepts a list of values, the prompt shows a select, the flag is `--styling tailwind`, a preset file takes `"styling": "tailwind"`.
- `when` in a `StackChange` can match a value.
- `--help` lists the values of each option.

**E0-S2. Opt-in options.** As someone creating a project, I want options that are off by default and add files when switched on, so that the default project stays as small as it is today.
- An option can default to `false`. Its overlay adds files, dependencies and doc lines instead of removing them.
- The doc edits of an added option are written as insertions next to an anchor that already exists, and a missing anchor stops the CLI like a missing replacement does today.

**E0-S3. Conflicts between options.** As someone creating a project, I want the CLI to refuse a combination that cannot work and tell me why, so that I do not get a project that fails its first check.
- An option can declare `conflicts` next to `requires`. `--ui shadcn --styling css` fails before anything is written, with a message naming both options.

**E0-S4. A matrix that stays affordable.** As a maintainer, I want `npm run matrix` to stay under the CI time budget when the number of options doubles, so that every combination is still tested where it matters.
- Choice values are crossed with each other, the other options are tested on and off against the default of the rest (pairwise, or the existing `independent` flag).
- The CI run reports how many projects it built and how long it took.
