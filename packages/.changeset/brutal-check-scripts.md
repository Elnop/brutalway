---
'@brutalway/check': minor
---

Every step is now an npm script of the project, run when it exists: `format:check`, `typecheck`, `lint`, `styles`, `deps`, `tree`, `duplicates`, `docs`, `messages`, `repo`, `unused`, `secrets` and `exceptions`. Prettier, alint, knip, check-secrets and check-exceptions are no longer run directly, so knip sees the tools in `package.json`.
