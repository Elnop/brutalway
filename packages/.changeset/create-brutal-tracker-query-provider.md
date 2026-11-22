---
'create-brutal': minor
---

`--analytics` writes `src/shared/analytics/analyticsTracker.ts`, called as `analyticsTracker.track(...)`, since an `xClient.ts` is a client of an external API. With `--server-state`, vite and react-native create the `QueryClient` in `src/features/query-client/QueryProvider.tsx`, as next does, and mount `<QueryProvider>` instead of a separate `queryClient.ts`. The projects get dependency-cruiser-config 0.13.0 and oxlint-config-react-native 0.3.3.

Coverage leaves out `XProvider.tsx` files, like the orchestrators, and `xTracker.ts` files, like the clients.
