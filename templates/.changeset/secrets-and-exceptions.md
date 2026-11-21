---
'template-fastify': minor
'template-next': minor
'template-package': minor
'template-react-native': minor
'template-vite': minor
---

`npm run check` ends with `check-secrets`, which fails when a file git would commit holds a key, a token or a password, and `check-exceptions`, which fails when a disable comment or an ignore list grew since the fork point with the main branch. The CI workflow clones the whole history so that `check-exceptions` finds that fork point. `docs/reference/verifications.md` describes both, and check-tree moves to 0.13.0.
