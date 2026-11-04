# elnop-stacks

Project templates where the conventions are enforced by deterministic checks. When several people or AI agents write in the same codebase, a convention that is only written down drifts within days. Here each one is a lint rule, an import rule or a tree rule, and `npm run check` fails with a message that says what to change.

Every template builds the same small floor plan editor with the same blueprint look, so the stacks can be compared sheet by sheet.

| Sheet | Stack | Status |
|---|---|---|
| [template-vite](https://github.com/Elnop/template-vite) | Vite, React, zustand, Vitest, Playwright | ready |
| template-next | Next.js | planned |
| template-react-native | React Native | planned |

## The common rules

- the code is split into layers (`app`, `features`, `states`, `shared`), each importing only the ones below, and features never import each other
- components are orchestrators, which read stores, or presenters, which only get props
- one way to write each construct, no comments, no relative imports, no barrel files
- files are named after what they export and placed by kind: one file stays at the root of its folder, two or more move into `components/`, `hooks/`, `lib/` and so on
- every dependency is pinned, every path cited in the docs exists, no export goes unused
- a Claude Code hook lints each file the agent edits and sends the errors back to it

The lint configs, plugins and every shared config (TypeScript, Prettier, dependency-cruiser, alint, Playwright fixtures, the agent hook) are published as `@elnop/*` from [Elnop/elnop-tooling](https://github.com/Elnop/elnop-tooling). Each template README lists the tools and how they map to these rules.

## Using a template

Each sheet is its own GitHub template repository: open it and click "Use this template". To get them all at once:

```sh
git clone --recurse-submodules https://github.com/Elnop/elnop-stacks.git
```
