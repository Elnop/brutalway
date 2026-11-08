# E8. Smaller options

The order follows how much each story touches: S3 goes into every project, S1 and S2 are options, S4 assembles what the others leave.

**E8-S3. Security headers.** Source: Wizcard (`next.config.ts`: CSP in report-only, HSTS, `X-Frame-Options`, `Permissions-Policy`). As someone deploying the app, I want strict headers from the start, so that I loosen them on purpose rather than write them from nothing.
- In every vite project, no option, and the CSP is enforced rather than report-only: the build of Vite has no inline script or style and the fonts are served from the app, so `default-src 'self'` holds. React sets the `style` prop through the DOM, which a CSP does not block.
- The headers are written once, in `securityHeaders.ts` at the root: a Vite plugin sends them from `vite preview` and writes them into `dist/_headers` at build time, the format of Netlify and Cloudflare Pages. The dev server sends none, since its HMR client needs inline code.
- `@brutalway/playwright-fixtures` fails a test when the browser reports a CSP violation, as it does for a page error.
- As built: the fixture listens to the console errors Chromium writes for a violation. The longer `include` of `tsconfig.test.json` no longer fits on one line, so Prettier spreads it, and an option that removes entries makes it fit again: the CLI now formats every `tsconfig*.json` after its edits, as it did for `knip.json`.

**E8-S1. React Compiler.** Source: Wizcard (`babel-plugin-react-compiler` installed). As someone creating a project, I want `--react-compiler`, so that I do not write `useMemo` and `useCallback` by hand.
- `@vitejs/plugin-react` 6 offers two ways: a Rust port (`compiler: true`), marked experimental in its README, and the official Babel plugin. The option takes the Babel one: `babel-plugin-react-compiler` 1.0 through `@rolldown/plugin-babel` and `reactCompilerPreset()` in `vite.config.ts`.
- With the option, importing `useMemo`, `useCallback` or `memo` from `react` is reported, with a message saying the compiler does it.
- As built: `babel-plugin-react-compiler` depends on `@babel/types` 7, so `@babel/core` is 7.29 rather than 8. Under Vitest the compiler first made `--coverage` fail on branches (46 % to 79 %), counting the checks of its memo caches, so `vite.config.ts` only adds it when `VITEST` is not set: the e2e tests still run the compiled build. The rule of `no-restricted-imports` is written the way Prettier spreads it, since it no longer fits on one line.

**E8-S2. Product analytics.** Source: Wizcard (PostHog, client and server). As someone creating a project, I want `--analytics`, so that events are sent from one module.
- A choice option: `none` (the default), `module` and `posthog`. With `module`, `src/shared/analyticsClient.ts` exports `track(name, properties)` and `subscribe(listener)`, with no dependency: the project plugs its own tool into it. With `posthog`, the same functions are written with `posthog-js`, the key is read from `import.meta.env`, and nothing is sent without it, in the e2e tests either. External loading is turned off, and the CSP lets the PostHog host through `connect-src`.
- The example tracks `todo_added`. A dependency-cruiser rule keeps `posthog-js` and the other analytics SDKs inside `analyticsClient.ts`.
- As built: the file exports an `analyticsClient` object, so it is named after its export, follows the `xClient.ts` convention of the modules that talk to a service (presenters cannot import it, coverage leaves it out), and the example calls it from `TodoListLayout.tsx`, the same line in every styling value. Without a tool, `module` dispatches an `analytics` event on `window` rather than doing nothing, so the events can be seen and listened to. Without the example nothing calls the client, so it is a knip entry.

**E8-S4. Instructions for agents.** Source: bedrock (`AGENTS.md`, `.agents/rules/*.md`), Wizcard (`CLAUDE.md`, `.clinerules`, `.windsurfrules`). As someone working with an agent other than Claude Code, I want an `AGENTS.md` that matches the options I picked, so that the agent knows which tool to use for what before it writes code.
- `AGENTS.md` in both templates, short: the commands, what `npm run check` runs, and pointers to `docs/verifications.md` and `docs/architecture.md`. Each option adds or removes its own lines, like it does in the README. `CLAUDE.md` imports it with `@AGENTS.md`.
- The lint messages stay as they are: they already say what to change.
- As built: `AGENTS.md` lists five conventions in the default vite project and up to six more with options, and alint checks its paths, so a renamed file cannot leave it pointing nowhere.
