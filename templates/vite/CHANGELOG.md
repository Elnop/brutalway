# template-vite

## 0.2.0

### Minor Changes

- a0fbb5d: `AGENTS.md` sums up for a coding agent what `npm run check` runs and the conventions worth knowing before writing code, with pointers to `README.md` and `docs/`. `CLAUDE.md` imports it with `@AGENTS.md`, and alint checks its paths like those of the README.
- 1e8e26f: `npm run check` runs `check-doc-length` (`@brutalway/check-doc-length`): a Markdown file of the project longer than 300 lines fails it, and `npx check-doc-length split <file>` shows how to cut it into a folder along its `##` headings.
- 1654ce3: `npm run check` runs `check-doc-links` (`@brutalway/check-doc-links`): a link of a Markdown file to a page that is gone fails it, other errors only warn, and nothing is requested when the machine is offline.
- 9c29d82: `npm run check` runs `check-doc-sources` (`@brutalway/check-doc-sources`): when a file you changed is cited by a Markdown file that did not change, it prints a warning naming the doc and the line, without failing.
- f1b60f3: `npm run check` runs jscpd (`.jscpd.json`): a block of 8 lines or 120 tokens that appears twice in `src/`, tests left out, fails it.
- 583202b: Every visible string goes through i18next, in English only. The messages are JSON in `src/app/locales/en/`, one namespace per slice (`app`, `todoList`, `todoStats`), `src/app/createI18n.ts` builds the instance and `src/main.tsx` wraps the app in an `I18nextProvider`. `npm run typecheck` first runs `i18next-cli types` into `node_modules/.cache/i18next/`, so an unknown key or a missing `{{title}}` is a tsc error, and `npm run messages` (in `check`) fails on a missing or unused key. `@brutalway/oxlint-config-i18next` reports visible text in JSX, in `aria-label`, `placeholder`, `title` and `alt`, and in template literals. `vitest.setup.ts` gives the tests the same instance. `countLabel.ts` gives way to i18next plurals, so `normalizeTitle.ts` moves up to `src/shared/`, and `TODO_FILTERS` only lists the filters.
- 9f58866: `securityHeaders.ts` holds the HTTP headers of the app, with an enforced Content Security Policy (`default-src 'self'`), HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`. A Vite plugin sends them from `vite preview`, so the e2e tests run under them, and writes them into `dist/_headers` at build time for Netlify and Cloudflare Pages.
- afbf814: stylelint checks the stylesheets with `@brutalway/stylelint-config`: outside of `src/app/globals.css`, a color is a `var()` of a custom property declared there, and the message names the closest tokens. `npm run check` runs it through `npm run styles`.
- a36a8fb: A blank title no longer disables the Add and Save buttons: submitting it shows "The title is blank" under the field, with `role="alert"`, `aria-invalid` and `aria-describedby`, and the e2e test runs axe on that state. `TodoInput.tsx` and `TodoEditor.tsx` read their field through `src/features/todo-list/shared/useTitleForm.ts`.

### Patch Changes

- Use the @brutalway packages of this release. `check-doc-links` keeps its default skipped links when `docLinks.skip` is set, `check-doc-sources` no longer crashes on a link with a malformed `%`, the agent hook says which check could not start, and `file-named-after-export` also reports a named default export.
- f1b60f3: `TodoFilters.tsx`, `TodoStats.tsx` and `TodoEditor.tsx` get their component tests, `TodoItem.test.tsx` checks a done task, and `todosStore.test.ts` checks `setFilter`.
- 0b57e92: `TodoListLayout.tsx` reads the todos through `src/features/todo-list/useTodoList.ts`, and the presenters type their callbacks with `Todo['id']`, so the data can come from somewhere else without touching the components.

## 0.1.0

### Minor Changes

- First versioned release. Vite, React and TypeScript, with a neo-brutalist todo list as the example app (zustand store in `src/shared-features/todos/`), Vitest unit and component tests, Playwright e2e, and the `@brutalway/*` checks run by `npm run check`, the pre-commit hook and CI.
