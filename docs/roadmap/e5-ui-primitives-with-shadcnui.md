# E5. UI primitives with shadcn/ui

Source: bedrock (`components.json`, `components/ui/`, `.agents/rules/ui-components.md`, rules `no-raw-jsx-primitives`, `no-faux-card-containers`, `no-lucide-react-imports`, the inventory guardrail).

bedrock vendors the whole shadcn library, then forbids raw `<button>`, `<input>`, `<select>` and hand-made cards in its own code. A script fails when the list of components in the docs drifts from the files.

shadcn files are vendored code: they come from a registry, and `npx shadcn add <name> --overwrite` must be able to replace them at any time. They follow shadcn's conventions, which break most brutalway rules. bedrock puts them in `components/ui/` and lists that folder as an exception in each tool. That does not work here: `src/shared/ui/` also holds components written for the app, which must keep every rule. So the vendored files leave `src/` altogether, and `src/` gets no exception at all.

## What breaks, measured

Tried on a project made with `npm create brutal` (vite, every option on), Tailwind v4 added, then `button input checkbox card dialog select sonner tabs dropdown-menu form calendar sidebar` added with the shadcn CLI:

| Tool | What fails on the vendored files |
|---|---|
| Prettier | every file (double quotes, no semicolons) |
| tsc | `calendar.tsx` (`noPropertyAccessFromIndexSignature`, 9 errors), `sonner.tsx` (`exactOptionalPropertyTypes`) |
| oxlint | 48 errors: `file-named-after-export`, `consistent-type-specifier-style`, `func-style`, `only-export-components`, `no-unsafe-type-assertion`, `filename-case`... |
| knip | components not used yet reported as unused files, `buttonVariants` as an unused export, plus `zod`, `@hookform/resolvers` and `date-fns`, which the CLI installs but no file imports |
| check-tree | `hooks/` holds only `use-mobile.ts` |
| dependency-cruiser | nothing once the dependencies are installed (the CLI installed `cn` but forgot `class-variance-authority` and `lucide-react`) |
| alint | nothing |

`exclude` is not enough for tsc: a file imported by the app is checked with the app's flags even when excluded.

## The method

The vendored files go to `third-party/shadcn/`, at the root of the project next to `src/` and `e2e/`, imported through a `@third-party/*` alias. Every alias of `components.json` (components, ui, utils, lib, hooks) points to `@third-party/shadcn`, and the shadcn CLI writes there without complaint, imports between its files included (`@third-party/shadcn/button`). `third-party/` only ever holds code copied from a registry, so a later registry (another shadcn namespace, for instance) gets its own `third-party/<name>/`.

The folder is `third-party/`, Chromium's name for it: it says what it holds, and the dash in `@third-party/*` costs nothing in an import. The spike (E5-S0) ran shadcn 4.23.0 with `@third-party/*`: it writes into `third-party/shadcn/` without complaint.

`src/` stays fully governed, `src/shared/ui/` included. The scripts already target `src` (`oxlint src e2e`, `depcruise src`, `check-tree src`), so they never see `third-party/`. What remains to set up:

| Tool | Setup |
|---|---|
| tsc | `tsconfig.third-party.json` is a composite project for `third-party/` with `exactOptionalPropertyTypes` and `noPropertyAccessFromIndexSignature` off, emitting declarations only into `node_modules/.cache/tsc-third-party`. `tsconfig.app.json` and `tsconfig.test.json` reference it, so the app sees the vendored files through their `.d.ts` and keeps every strict flag. `typecheck` becomes `tsc -b tsconfig.app.json tsconfig.test.json`. |
| Vite | the `@third-party/` alias next to `@/` |
| Prettier | `third-party` and `components.json` in `.prettierignore`, so an `--overwrite` produces no formatting diff |
| knip | `third-party/**/*.{ts,tsx}` as an entry: a component not used yet is not reported, and the packages it imports still count as used. A package the shadcn CLI installs without any file importing it is still reported. |
| oxlint | `third-party` in `ignorePatterns`, only for the agent hook, which passes the edited file by path |
| dependency-cruiser | `depcruise src third-party`, with the two rules of E5-S4 |
| check-tree, alint | nothing |

Tailwind v4 finds the classes in `third-party/` by itself. On the test project, with a `Panel.tsx` in `src/shared/ui/` that wraps the shadcn `Card` and a hand-written `Badge.tsx` next to it, `npm run check` and `vite build` pass, and check-tree still applies to `src/shared/ui/`: with two components there, it asked to move them into `components/`.

Styling goes through tokens first, and the spike showed they do most of the work. Under `@theme`, `--default-border-width: 3px` turns every bare `border` class of the vendored files into a thick border, `--radius-*: initial` makes every `rounded-md` square, and `--shadow-xs` and `--shadow-sm` become hard shadows. What no token reaches, a Button with no border class at all, is written once per primitive with its `data-slot` attribute (`[data-slot='button'] { ... }`), which every shadcn primitive sets, in `@layer base`: there it fills a property no utility sets, and a class the app passes to the primitive still wins. It loses to an arbitrary value written in the vendored file (the Checkbox's `rounded-[4px]`), so that one is fixed by the class the presenter passes, or by a wrapper. A variant the app needs and shadcn does not have is a component in `src/shared/ui/` that wraps the primitive, written under the usual rules.

shadcn's colors are mapped onto the neo-brutalist ones under `@theme inline` (`--color-primary: var(--color-yellow)`), so a project has two vocabularies, `ink`/`paper`/`yellow` and `primary`/`muted-foreground`, in the same file. Both are tokens: `@brutalway/oxlint-config-tailwind` already reads `@theme inline`, `bg-primary` passes in `src/` and `bg-zinc-500` is still reported. There is no `.dark` block, so the `dark:` classes of the vendored files never apply, which matches E1-S5.

The vendored files the example needs are committed in the overlay (`overlays/vite/shadcn/third-party/shadcn/`), written by a script of the repo that runs a pinned version of the shadcn CLI. The scaffold stays offline, and the matrix tests the files the user gets. The repo's `.prettierignore` gets `**/third-party`, since it does not skip `overlays/` today. The generated project pins `shadcn` in its devDependencies, so `npx shadcn add` runs the same version and E5-S5 has a version to compare the folder against.

As built: the vendored files of the example are written by `packages/tools/create-brutal/scripts/vendorShadcn.ts`, which runs the shadcn CLI in a temporary project with the version and the primitives of `src/stacks/shadcnConfig.ts`. The shadcn CLI refuses to run when the root `tsconfig.json` has no `paths`, so it declares `@third-party/*` too, and lists `tsconfig.third-party.json` next to the other two. The tokens also keep two font weights only (`--font-weight-*: initial`), so the `font-medium` of the Button produces nothing and the `[data-slot='button']` rule makes it bold. `--default-border-width: 3px` applies to the app's own `border` classes as well, which the example does not use. In the example, the filters and the Edit and Cancel buttons are the `secondary` variant, Delete and Clear done are `destructive`, and the Checkbox gets `size-6 rounded-none` from `TodoItem.tsx`. The matrix adds `dialog` and `sonner` after the scaffold: `sonner` fails `exactOptionalPropertyTypes`, so it shows that the separate TypeScript project works.

The boundaries of E5-S4 are a third entry point, `@brutalway/dependency-cruiser-config/shadcn`, which extends the layers, so a project without shadcn can still import `radix-ui` from `src/`. E5-S5 is a `--vendored third-party` flag of `@brutalway/agent-hook`: the `PostToolUse` hook skips those files, and the same command as a `PreToolUse` hook refuses the edit. Comparing `third-party/shadcn/` with the registry in CI is not done. E5-S6 and E5-S8 share `@brutalway/oxlint-config-shadcn`: `<input type="checkbox">` points to `Checkbox`, `<input type="radio">` to `RadioGroup`, and `<input type="hidden">` is left alone. Since `shadcn add` runs `npm install`, the matrix runs it with the same `package.json` pointing to the local tarballs as its own install, so a package version not published yet does not stop it.

## Stories

**E5-S0. Spike.** Done on a project made with `--styling tailwind` and Button, Input, Checkbox and Card added by shadcn 4.23.0, styles measured in Chromium.
- The shadcn CLI writes into `third-party/shadcn/` through `@third-party/*`.
- `cn` is now a package of its own, published by shadcn (it replaces `clsx` and `tailwind-merge`), so there is no `utils.ts` to vendor. The CLI installs `cn` and `radix-ui` and still misses `class-variance-authority` and `lucide-react`.
- Tokens and `[data-slot]` rules in `@layer base` give the neo-brutalist look, with the limit above.
- tsc passes on these four files with the app's flags, knip reports their unused exports (`buttonVariants`, `CardFooter`...) until they are entries. E5-S2 stays for components like `calendar` and `sonner`.

**E5-S1. shadcn/ui as an option.** As someone creating a project, I want `--ui shadcn`, so that I start with accessible primitives styled like the rest of the series.
- `ui` is a choice option (`none`, `shadcn`), `none` by default. The value `shadcn` declares `requires: { styling: 'tailwind' }`, which `optionRules.ts` already handles.
- Only the primitives the example uses are vendored (Button, Input, Checkbox, Card). A `shadcn-example` overlay replaces the presenters of `tailwind-example`: the filters are Buttons with `aria-pressed`, the check mark is lucide's `CheckIcon` inside the shadcn Checkbox. `useTitleForm` stays the only form code, with or without `--forms`: no shadcn `Form` or `Field`.
- The shadcn Checkbox is a `button` with `role="checkbox"` and `onCheckedChange`: `TodoItem.test.tsx` and the e2e test still find it by role and still pass with `toBeChecked()`.
- The CLI writes `components.json` with every alias on `@third-party/shadcn`, adds the `@third-party/*` alias to the tsconfigs and to Vite, and pins the packages the vendored files import, since the shadcn CLI misses some.
- The README explains how to add one with `npx shadcn add <name>`, and that a primitive with an animation (`dialog`, `dropdown-menu`...) needs `tw-animate-css` and its `@import` in `src/app/globals.css`, which the shadcn CLI does not write since the project owns that file.

**E5-S2. A TypeScript project for vendored code.** As someone working on the project, I want vendored files checked with shadcn's flags and my code with all of brutalway's, so that adding a component never makes `npm run check` fail on code I did not write.
- `tsconfig.third-party.json`, the references and the `tsc -b` script as above. An error in `src/` is still reported, an error in `third-party/` only if it fails with the relaxed flags.
- The `.tsbuildinfo` and declarations stay under `node_modules/.cache`, nothing new to gitignore.
- `@brutalway/tsconfig` ships `react-vite-third-party.json` with the two flags off, so the relaxed set is defined once.

**E5-S3. The other tools leave `third-party/` alone.** As someone working on the project, I want Prettier and knip set up as above, so that `--overwrite` gives the registry's file byte for byte and `npm run check` stays green.
- The matrix (E0-S4) runs with a component added after the scaffold, to catch a tool that starts reading `third-party/`.
- alint: a rule that `third-party/` only holds folders listed in a config file (`components.json` for shadcn), so nobody drops hand-written code there to escape the rules.

**E5-S4. Boundaries of the vendored folder.** As someone working on the project, I want `third-party/` to import nothing from `src/`, and the packages behind shadcn to be imported only from `third-party/`, so that swapping a primitive happens in one place.
- Rules in `@brutalway/dependency-cruiser-config`: `third-party-not-to-src`, and `third-party-packages-only-from-third-party` for `radix-ui` and `class-variance-authority`. Both tried on the test project: an import of `radix-ui` from `src/shared/lib/` and an import of `src/` from `third-party/shadcn/` are both reported.
- `cn` stays allowed in `src/`: it merges Tailwind classes, the app needs it for its own conditional classes, and swapping a primitive does not touch it.
- Code in `src/` may import `@third-party/shadcn/` from any layer, since `third-party/` imports nothing from the app.

**E5-S5. No hand edits.** As someone working on the project, I want an edit to a vendored file to be refused with what to do instead, so that the folder always matches the registry.
- `@brutalway/agent-hook` stops on a file under `third-party/`, with the message: run `npx shadcn add <name> --overwrite`, restyle in `src/app/globals.css` through tokens or `data-slot`, or wrap the primitive in `src/shared/ui/`. The hook lints after the edit today, so refusing it before means a `PreToolUse` entry next to the current one.
- Without that, the hook would fail on these files for a different reason: `oxlint <ignored file>` exits with 1 and "No files found to lint". The hook passes `--no-error-on-unmatched-pattern` or skips ignored files.
- Look into a CI check that compares `third-party/shadcn/` with the registry at the version of `shadcn` pinned in `package.json`.

**E5-S6. Primitives first.** As someone working on the project, I want an error when I write a raw `<button>` or `<input>` in `src/`, so that every control behaves the same way.
- New package `@brutalway/oxlint-config-shadcn`, added with `--ui shadcn`, as E3 and E4 add theirs.
- `button`, `input`, `textarea` and `select` are reported, the message names the primitive to import, and gives `npx shadcn add <name>` when it is not vendored yet.

**E5-S8. One icon library.** As someone working on the project, I want a single icon set, so that icons look alike.
- The one set in `components.json` (`lucide` by default), allowed in `src/`. Imports of `react-icons`, `@heroicons/*`, `@radix-ui/react-icons`, `@tabler/icons-react` and the other sets are reported by `@brutalway/oxlint-config-shadcn`.

**E5-S7, later. The docs list what is vendored.** A `docs/ui.md` table of each file of `third-party/shadcn/` and each component of `src/shared/ui/`, with a check that fails when a file and a row drift apart. No tool does that yet: it waits for a small generic one (a table in a `.md` against a glob), which E9 could use too.

Order: S0, then S1 with S2 and S3 (the option does not pass `npm run check` without them), then S4, then S6 with S8, then S5.
