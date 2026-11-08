# E7. More checks on React code

Source: bedrock's ESLint plugin and `.jscpd.json`, Wizcard's `sonarjs` setup.

These are rules, not options, except the coverage gate: they go into the shared Oxlint configs and apply to every project. Each one was checked against the example first, on a project with `css-modules`, `server-state`, `forms`, `i18n` and component tests.

What exists already: Oxlint has `react/no-array-index-key`, `Math.random()` during render is reported by `react/purity`, and `as unknown as` is reported by `typescript/no-unsafe-type-assertion`, which the TypeScript base already turns on. `no-restricted-globals` is native too.

`eslint-plugin-sonarjs` does not load as an Oxlint JS plugin: it ships its own TypeScript 6, but `ts-api-utils`, hoisted to the root of `node_modules`, finds the project's TypeScript 7, which has no JavaScript API, and crashes on `TypeFlags.Intrinsic`. The file of `cognitive-complexity` (`eslint-plugin-sonarjs/cjs/S3776/rule.js`) loads on its own, and a plugin of a few lines that only exports it runs as an Oxlint JS plugin with the same score (22 on the test function, nothing above 15 in the example). That keeps Sonar's own algorithm. The path is internal to the package, so the version is pinned exactly and a fixture test fails if the file moves.

jscpd with bedrock's settings (8 lines, 120 tokens, tests left out) finds no clone in the example. Vitest covers 56 % of its lines, since orchestrators, hooks and clients are covered by the e2e tests, as `docs/verifications.md` says. `TodoFilters.tsx` and `TodoStats.tsx` have no component test.

**E7-S1. Rules taken from bedrock.** As someone working on the project, I want the following mistakes reported, so that a review does not have to catch them.
- `react/no-array-index-key`, in `@brutalway/oxlint-config-react`.
- `localStorage` and `sessionStorage` only in an `xStorage.ts` file (`no-restricted-globals` with an override). `languagePreference.ts` from E6 becomes `languageStorage.ts`.
- No `useX.tsx`: a hook file is `.ts`, its JSX goes into a component.
- No formatting in a presenter: `Intl`, `toLocaleString`, `toLocaleDateString`, `toFixed`, `sort`, `filter` and `reduce` are reported in a component that is not an orchestrator. `map` stays allowed for rendering. The work moves to the orchestrator or a hook.
- An orchestrator (`XContainer`, `XLayout`, `XPage`) calls at least one hook, or it is a presenter with the wrong name.
- A component takes at most 6 props (`TodoItem` takes 4).

**E7-S2. No duplicated code.** As a maintainer, I want jscpd in `npm run check` with a threshold of 0 (bedrock's setting: 8 lines, 120 tokens, tests excluded), so that copy and paste is caught when it happens.
- In every vite and fastify project, no option: the example passes already.

**E7-S3. Coverage gate.** As a maintainer, I want `npm test` to fail under a coverage threshold, so that the tests keep up with the code.
- Option `--coverage`, off by default, which needs component tests. `@vitest/coverage-v8` with a 90 % threshold on what Vitest is meant to test: presenters, pure functions, selectors and stores. Orchestrators, hooks, clients and `src/app/` are left out, the e2e tests cover them.
- `TodoFilters.tsx` and `TodoStats.tsx` get their component tests.

**E7-S4. Cognitive complexity.** As someone working on the project, I want a function that is too hard to follow to be reported, so that it gets split.
- `sonarjs/cognitive-complexity` at 15 (Sonar's default) in `@brutalway/oxlint-config-typescript`, for vite and fastify, through the plugin above and an exact version of `eslint-plugin-sonarjs`.

Order: S4 and S1 (the configs), then S2, then S3.

As built: the S1 rules are `no-restricted-syntax` selectors in two more plugin instances of `@brutalway/oxlint-config-react` (`component-roles`, `hook-files`), next to the native `react/no-array-index-key` and `no-restricted-globals`. The 7th prop of an `XProps` type is reported (`:nth-child(7)`), and an orchestrator without a hook call through `:has()`. Turning on cognitive complexity in the repository reported `resolveAnswers.ts` at 18, which now hands each answer to `givenAnswer` or `pickedAnswer`. The 90 % threshold first failed on branches (84 %): `TodoEditor.tsx`, a done `TodoItem.tsx` and `setFilter` had no test, and now do. `no-literal-string` is off in `*.test.tsx`, where a test passes literal props. A project without the example and with `coverage` has nearly nothing to measure and passes.
