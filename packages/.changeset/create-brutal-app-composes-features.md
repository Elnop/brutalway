---
'create-brutal': minor
---

A created project follows the templates: `src/app/` imports features only. With `server-state`, the `QueryClient` lives in `src/features/query-client/`, along with `QueryConfig.ts` when there is no example. On react-native without the example, `--analytics` puts `analyticsClient.ts` and the `useAppOpened` hook that sends `app_opened` in `src/features/analytics/`. On fastify without a database, the todos of the example stay in a `Map` shared by both services. A stack change can now `move` files.
