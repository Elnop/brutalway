---
'template-fastify': minor
---

A feature is registered by one entry of `FEATURES` in `src/app/AppConfig.ts`, and `src/app/buildApp.ts` registers them in order: adding a feature no longer edits `buildApp.ts`, which stays within the size limits however many features the API has.
