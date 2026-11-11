---
'create-brutal': minor
---

`npm create brutal` offers a `next` stack, template-next on the Next.js App Router. It takes the options of the vite stack except `server-state`: styling, shadcn/ui, dark theme, forms, i18n, React Compiler, analytics, component tests, coverage, e2e, the Claude Code hook and CI. With `i18n`, the language is saved in a cookie and read on the server, so the page comes in the right language from the first render. The changes both front-end stacks share now live in `src/features/stacks/configs/frontendChangesConfig.ts`, and each stack fills in its own file names through `fillAnchors`. The vite projects come out byte for byte the same.
