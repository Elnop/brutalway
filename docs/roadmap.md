# Roadmap

Epics E0 to E9 are done. The vite stack offers its styling as plain CSS, CSS Modules or Tailwind, plus shadcn/ui, TanStack Query, react-hook-form with Zod, i18next, the React Compiler and analytics, and `check-doc-length` and `check-doc-sources` keep the docs in check. The notes of each epic stay in the git history of `docs/roadmap/`.

The dark theme came after them, as the `dark-theme` option. One thing is left.

## Vendored files that match the registry

The agent hook refuses an edit under `third-party/`, but an edit made by hand goes through. A CI check could run `npx shadcn add <name> --overwrite` on each file of `third-party/shadcn/`, with the version of `shadcn` pinned in `package.json`, and fail when the result differs.
